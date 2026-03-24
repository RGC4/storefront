#!/usr/bin/env python3
"""
shopify-normalize.py
Full pipeline: Shopify → rembg background removal → tight crop → 2048x2048 canvas → Shopify

Usage:
  python3 shopify-normalize.py           # full run, all products
  python3 shopify-normalize.py --test    # test mode: first 5 products only, saves locally so you can review BEFORE uploading

Requirements:
  pip install rembg[cpu] pillow requests numpy
  (first run will download the AI model ~170MB, then it's cached forever)
"""

import sys
import os
import io
import time
import base64
import argparse
import json
from pathlib import Path

import requests
import numpy as np
from PIL import Image

# ── Config ────────────────────────────────────────────────────────────────────
SHOP          = "rgc4-3.myshopify.com"
TOKEN         = "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"
API_VERSION   = "2026-01"

CANVAS        = 2048       # output canvas size (square)
PADDING_PCT   = 0.08       # 8% padding around the bag on each side
JPEG_QUALITY  = 92

TEST_PRODUCTS = 5          # how many products to process in --test mode
TEST_OUT_DIR  = "./test-output"   # where to save test images for review
# ─────────────────────────────────────────────────────────────────────────────

BASE_URL = f"https://{SHOP}/admin/api/{API_VERSION}"
HEADERS  = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json",
}


# ── Shopify API ───────────────────────────────────────────────────────────────

def get_all_products():
    products   = []
    page_info  = None
    print("  Fetching products from Shopify...")
    while True:
        params = {"limit": 50, "fields": "id,title,images"}
        if page_info:
            params["page_info"] = page_info
        r = requests.get(f"{BASE_URL}/products.json", headers=HEADERS, params=params)
        r.raise_for_status()
        batch = r.json()["products"]
        products.extend(batch)
        print(f"    {len(products)} products fetched so far...")

        link = r.headers.get("Link", "")
        import re
        m = re.search(r'<[^>]*page_info=([^&>]+)[^>]*>;\s*rel="next"', link)
        if m:
            page_info = m.group(1)
        else:
            break
    return products


def download_image(url):
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.content


def upload_image(product_id, image_id, image_bytes, position):
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    payload = {"image": {"id": image_id, "attachment": b64, "position": position}}
    r = requests.put(
        f"{BASE_URL}/products/{product_id}/images/{image_id}.json",
        headers=HEADERS,
        json=payload,
        timeout=60,
    )
    r.raise_for_status()


# ── Image processing ──────────────────────────────────────────────────────────

def remove_background(image_bytes: bytes) -> Image.Image:
    """Use rembg AI to remove the background. Returns RGBA PIL image."""
    from rembg import remove
    result_bytes = remove(image_bytes)
    return Image.open(io.BytesIO(result_bytes)).convert("RGBA")


def tight_crop(rgba: Image.Image) -> Image.Image:
    """Crop to the tightest bounding box of non-transparent pixels."""
    alpha = np.array(rgba)[:, :, 3]
    rows  = np.any(alpha > 10, axis=1)
    cols  = np.any(alpha > 10, axis=0)
    if not rows.any():
        return rgba   # fully transparent fallback
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return rgba.crop((cmin, rmin, cmax + 1, rmax + 1))


def place_on_canvas(subject: Image.Image) -> Image.Image:
    """Scale subject to fill canvas minus padding, center on white background."""
    canvas  = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 255))
    max_dim = int(CANVAS * (1 - 2 * PADDING_PCT))
    subject = subject.copy()
    subject.thumbnail((max_dim, max_dim), Image.LANCZOS)
    x = (CANVAS - subject.width)  // 2
    y = (CANVAS - subject.height) // 2
    canvas.paste(subject, (x, y), subject)
    return canvas


def normalize_image(image_bytes: bytes) -> bytes:
    """Full pipeline: bytes in → normalized JPEG bytes out."""
    # 1. Remove background
    no_bg = remove_background(image_bytes)

    # 2. Tight crop to just the subject
    cropped = tight_crop(no_bg)

    # 3. Place centered on white canvas
    final_rgba = place_on_canvas(cropped)

    # 4. Flatten to white RGB and encode as JPEG
    final_rgb = Image.new("RGB", (CANVAS, CANVAS), (255, 255, 255))
    final_rgb.paste(final_rgba, mask=final_rgba.split()[3])

    buf = io.BytesIO()
    final_rgb.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return buf.getvalue()


# ── Processing ────────────────────────────────────────────────────────────────

def process_product(product, test_mode=False, test_dir=None):
    images = product.get("images", [])
    if not images:
        print(f"  (no images, skipping)")
        return 0, 0

    ok = 0
    fail = 0

    for image in images:
        img_id   = image["id"]
        position = image["position"]
        src      = image["src"]

        try:
            sys.stdout.write(f"    [{position}/{len(images)}] downloading... ")
            sys.stdout.flush()
            original = download_image(src)

            sys.stdout.write("removing bg... ")
            sys.stdout.flush()
            normalized = normalize_image(original)

            if test_mode:
                # Save locally for review instead of uploading
                out_path = Path(test_dir) / f"{product['id']}_{img_id}_pos{position}.jpg"
                out_path.write_bytes(normalized)
                sys.stdout.write(f"saved → {out_path.name}\n")
            else:
                sys.stdout.write("uploading... ")
                sys.stdout.flush()
                upload_image(product["id"], img_id, normalized, position)
                sys.stdout.write("✓\n")
                time.sleep(0.6)   # Shopify rate limit: 2 req/sec

            ok += 1

        except Exception as e:
            sys.stdout.write(f"✗ ERROR: {e}\n")
            fail += 1

    return ok, fail


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--test",
        action="store_true",
        help=f"Process only the first {TEST_PRODUCTS} products and save images locally for review. Does NOT upload to Shopify.",
    )
    args = parser.parse_args()

    print()
    print("=" * 55)
    print("  Prestige Apparel — Image Normalizer (rembg AI)")
    print("=" * 55)
    if args.test:
        print(f"  ⚡ TEST MODE — first {TEST_PRODUCTS} products only, saved to {TEST_OUT_DIR}/")
        print(f"     Review the images before running the full batch.")
    else:
        print(f"  🚀 FULL RUN — all products will be updated in Shopify")
    print(f"  Canvas: {CANVAS}×{CANVAS}px | Padding: {int(PADDING_PCT*100)}% each side")
    print()

    # Warm up rembg (downloads model on first run ~170MB)
    print("Initializing rembg AI model (first run downloads ~170MB)...")
    try:
        from rembg import remove
        remove(b"\x89PNG\r\n")   # tiny dummy call to trigger model download
    except Exception:
        pass   # the dummy bytes will fail but the model will be cached
    print("  Model ready.")
    print()

    products = get_all_products()
    print(f"  Found {len(products)} products ({sum(len(p.get('images',[])) for p in products)} images total)")
    print()

    if args.test:
        products = products[:TEST_PRODUCTS]
        Path(TEST_OUT_DIR).mkdir(exist_ok=True)
        print(f"Processing {len(products)} products in test mode...\n")
    else:
        print(f"Processing all {len(products)} products...\n")

    total_ok   = 0
    total_fail = 0

    for i, product in enumerate(products, 1):
        print(f"[{i}/{len(products)}] {product['title']}")
        ok, fail = process_product(product, test_mode=args.test, test_dir=TEST_OUT_DIR)
        total_ok   += ok
        total_fail += fail
        print()

    print("=" * 55)
    if args.test:
        print(f"  Test complete!")
        print(f"  {total_ok} images saved to {TEST_OUT_DIR}/")
        print(f"  {total_fail} errors")
        print()
        print("  → Review the images in that folder.")
        print("  → If they look good, run: python3 shopify-normalize.py")
        print("  → That will process all products and upload to Shopify.")
    else:
        print(f"  Done! {total_ok} images updated, {total_fail} errors.")
    print("=" * 55)
    print()


if __name__ == "__main__":
    main()
