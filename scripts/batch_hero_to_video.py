"""
Batch Hero Image to Video Converter — Wan 2.2 5B Model
Scans all store folders for hero images, sends them to ComfyUI,
and saves the output video back to the same folder.

Each image can have a matching prompt file:
    hero-1.png → prompt-1.txt
    hero-tops.png → prompt-tops.txt

If no prompt file found, uses DEFAULT_PROMPT.

Usage: python batch_hero_to_video.py
"""

import json
import os
import shutil
import time
import urllib.request

# ─────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────
ROOT_FOLDER        = r"C:\dev\s1\storefront\pictures"
COMFYUI_URL        = "http://127.0.0.1:8188"
COMFYUI_INPUT_DIR  = r"C:\AI\ComfyUI\input"
COMFYUI_OUTPUT_DIR = r"C:\AI\ComfyUI\output\video"

# Video settings
WIDTH   = 1280
HEIGHT  = 704
LENGTH  = 121   # frames (~5 seconds at 24fps)

# Default prompt if no prompt file found
DEFAULT_PROMPT = (
    "Elegant slow cinematic motion, sophisticated women in premium designer clothing "
    "walking with effortless confidence, soft natural lighting with golden hour warmth, "
    "smooth camera movement gently drifting forward, ultra high quality, photorealistic, "
    "luxury fashion editorial style, soft bokeh background, graceful fluid movement, "
    "hair and fabric moving naturally in a gentle breeze, aspirational and refined "
    "atmosphere, no sudden movements, seamless loop, perfect loop"
)

# Negative prompt
NEGATIVE_PROMPT = (
    "色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，"
    "最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，"
    "画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，"
    "杂乱的背景，三条腿，背景人很多，倒着走"
)

# ─────────────────────────────────────────────
# GET PROMPT FOR IMAGE
# ─────────────────────────────────────────────
def get_prompt(image_path):
    base = os.path.splitext(image_path)[0]
    image_name = os.path.basename(base)
    folder = os.path.dirname(image_path)

    # Try matching prompt: hero-tops.png → prompt-tops.txt
    suffix = image_name.replace("hero", "prompt", 1)
    prompt_path = os.path.join(folder, suffix + ".txt")
    if os.path.exists(prompt_path):
        with open(prompt_path, "r", encoding="utf-8", errors="ignore") as f:
            prompt = f.read().strip()
        print(f"  📝 Using {os.path.basename(prompt_path)}: {prompt[:80]}...")
        return prompt

    # Fall back to prompt.txt
    prompt_path = os.path.join(folder, "prompt.txt")
    if os.path.exists(prompt_path):
        with open(prompt_path, "r", encoding="utf-8", errors="ignore") as f:
            prompt = f.read().strip()
        print(f"  📝 Using prompt.txt: {prompt[:80]}...")
        return prompt

    print(f"  📝 No prompt file found — using default")
    return DEFAULT_PROMPT

# ─────────────────────────────────────────────
# BUILD WORKFLOW — Wan 2.2 5B
# ─────────────────────────────────────────────
def build_workflow(image_filename, prompt):
    return {
        "37": {
            "inputs": {"unet_name": "wan2.2_ti2v_5B_fp16.safetensors", "weight_dtype": "default"},
            "class_type": "UNETLoader"
        },
        "38": {
            "inputs": {"clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors", "type": "wan", "device": "default"},
            "class_type": "CLIPLoader"
        },
        "39": {
            "inputs": {"vae_name": "wan2.2_vae.safetensors"},
            "class_type": "VAELoader"
        },
        "48": {
            "inputs": {"model": ["37", 0], "shift": 8.0},
            "class_type": "ModelSamplingSD3"
        },
        "6": {
            "inputs": {"text": prompt, "clip": ["38", 0]},
            "class_type": "CLIPTextEncode"
        },
        "7": {
            "inputs": {"text": NEGATIVE_PROMPT, "clip": ["38", 0]},
            "class_type": "CLIPTextEncode"
        },
        "56": {
            "inputs": {"image": image_filename, "upload": "image"},
            "class_type": "LoadImage"
        },
        "55": {
            "inputs": {
                "vae": ["39", 0],
                "start_image": ["56", 0],
                "width": WIDTH,
                "height": HEIGHT,
                "length": LENGTH,
                "batch_size": 1
            },
            "class_type": "Wan22ImageToVideoLatent"
        },
        "3": {
            "inputs": {
                "model": ["48", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["55", 0],
                "seed": 0,
                "control_after_generate": "randomize",
                "steps": 20,
                "cfg": 5.0,
                "sampler_name": "uni_pc",
                "scheduler": "simple",
                "denoise": 1.0
            },
            "class_type": "KSampler"
        },
        "8": {
            "inputs": {"samples": ["3", 0], "vae": ["39", 0]},
            "class_type": "VAEDecode"
        },
        "57": {
            "inputs": {"images": ["8", 0], "fps": 24},
            "class_type": "CreateVideo"
        },
        "58": {
            "inputs": {
                "video": ["57", 0],
                "filename_prefix": "video/Wan2.2_5B",
                "format": "auto",
                "codec": "auto"
            },
            "class_type": "SaveVideo"
        }
    }

# ─────────────────────────────────────────────
# COMFYUI API
# ─────────────────────────────────────────────
def queue_prompt(workflow):
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"  ❌ ComfyUI error: {error_body}")
        raise

def wait_for_completion(prompt_id, timeout=7200):
    print(f"  ⏳ Waiting for job to complete...")
    start = time.time()
    while time.time() - start < timeout:
        with urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}") as response:
            history = json.loads(response.read())
            if prompt_id in history:
                print(f"  ✅ Job completed in {int(time.time()-start)}s!")
                return True
        time.sleep(5)
        elapsed = int(time.time() - start)
        if elapsed % 30 == 0:
            print(f"  Still processing... ({elapsed}s elapsed)")
    print(f"  ⚠️ Timeout after {timeout}s")
    return False

# ─────────────────────────────────────────────
# FIND ALL HERO IMAGES
# ─────────────────────────────────────────────
def find_hero_images():
    found = []
    for folder in sorted(os.listdir(ROOT_FOLDER)):
        full_folder = os.path.join(ROOT_FOLDER, folder)
        if os.path.isdir(full_folder):
            for filename in sorted(os.listdir(full_folder)):
                if filename.startswith("hero-") and filename.endswith(".png"):
                    image_path = os.path.join(full_folder, filename)
                    found.append((folder, full_folder, image_path, filename))
    return found

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def process_batch():
    images = find_hero_images()

    if not images:
        print("❌ No hero-*.png files found in any store folder!")
        return

    print(f"✅ Found {len(images)} hero image(s) to process:\n")
    for folder, _, path, filename in images:
        print(f"  📁 {folder} → {filename}")
    print()

    for folder, full_folder, image_path, filename in images:
        print(f"─────────────────────────────────────────")
        print(f"🎬 Processing: {folder} / {filename}")

        prompt = get_prompt(image_path)

        dest_image = os.path.join(COMFYUI_INPUT_DIR, filename)
        shutil.copy2(image_path, dest_image)
        print(f"  📋 Copied image to ComfyUI input folder")

        workflow = build_workflow(filename, prompt)
        result = queue_prompt(workflow)
        prompt_id = result.get("prompt_id")
        print(f"  🚀 Queued job: {prompt_id}")

        success = wait_for_completion(prompt_id)

        if success:
            time.sleep(3)
            mp4_files = [f for f in os.listdir(COMFYUI_OUTPUT_DIR) if f.endswith(".mp4")]
            if mp4_files:
                latest = max(mp4_files, key=lambda f: os.path.getmtime(
                    os.path.join(COMFYUI_OUTPUT_DIR, f)))
                output_video = os.path.join(COMFYUI_OUTPUT_DIR, latest)
                video_filename = filename.replace(".png", ".mp4")
                dest_video = os.path.join(full_folder, video_filename)
                if os.path.exists(dest_video):
                    os.remove(dest_video)
                    print(f"  🗑️  Deleted existing {video_filename}")
                shutil.move(output_video, dest_video)
                print(f"  💾 Saved: {dest_video}")
            else:
                print(f"  ⚠️ No output video found")
        else:
            print(f"  ❌ Failed to process {filename}")

    print(f"\n─────────────────────────────────────────")
    print(f"✅ Batch complete! Processed {len(images)} image(s)")

if __name__ == "__main__":
    process_batch()
