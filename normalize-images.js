// normalize-images.js
// Usage: node normalize-images.js
// Requires: npm install sharp axios form-data

const sharp = require("sharp");
const axios = require("axios");
const FormData = require("form-data");
const https = require("https");

const SHOP = "rgc4-3.myshopify.com";

const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const CANVAS = 800;       // final image size in pixels
const PRODUCT_SIZE = 680; // bag takes up 85% of canvas
const BG_COLOR = { r: 255, g: 255, b: 255, alpha: 1 }; // white background

const api = axios.create({
  baseURL: `https://${SHOP}/admin/api/2026-01`,
  headers: { "X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json" },
});

async function getAllProducts() {
  let products = [];
  let pageInfo = null;

  do {
    const params = { limit: 50, fields: "id,title,images" };
    if (pageInfo) params.page_info = pageInfo;

    const res = await api.get("/products.json", { params });
    products = products.concat(res.data.products);

    const linkHeader = res.headers["link"] || "";
    const nextMatch = linkHeader.match(/<[^>]*page_info=([^&>]+)[^>]*>;\s*rel="next"/);
    pageInfo = nextMatch ? nextMatch[1] : null;

    console.log(`  Fetched ${products.length} products so far...`);
  } while (pageInfo);

  return products;
}

async function downloadImage(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

async function normalizeImage(imageBuffer) {
  // Get original image metadata
  const meta = await sharp(imageBuffer).metadata();

  // Resize to fit within PRODUCT_SIZE x PRODUCT_SIZE keeping aspect ratio
  const resized = await sharp(imageBuffer)
    .resize(PRODUCT_SIZE, PRODUCT_SIZE, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer();

  // Get the resized dimensions
  const resizedMeta = await sharp(resized).metadata();
  const left = Math.floor((CANVAS - resizedMeta.width) / 2);
  const top = Math.floor((CANVAS - resizedMeta.height) / 2);

  // Place on white canvas
  const normalized = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([{ input: resized, left, top }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return normalized;
}

async function uploadAndUpdateImage(productId, imageId, imageBuffer, position) {
  const base64 = imageBuffer.toString("base64");

  await api.put(`/products/${productId}/images/${imageId}.json`, {
    image: {
      id: imageId,
      attachment: base64,
      position,
    },
  });
}

async function processProduct(product) {
  if (!product.images || product.images.length === 0) return;

  console.log(`\nProcessing: ${product.title} (${product.images.length} images)`);

  for (const image of product.images) {
    try {
      process.stdout.write(`  Image ${image.position}: downloading...`);
      const original = await downloadImage(image.src);

      process.stdout.write(" normalizing...");
      const normalized = await normalizeImage(original);

      process.stdout.write(" uploading...");
      await uploadAndUpdateImage(product.id, image.id, normalized, image.position);

      console.log(" done.");

      // Rate limit — Shopify allows 2 requests/sec on standard plans
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
    }
  }
}

async function main() {
  console.log("===========================================");
  console.log(" Prestige Apparel — Image Normalizer");
  console.log("===========================================");
  console.log(`Canvas: ${CANVAS}x${CANVAS}px | Product area: ${PRODUCT_SIZE}x${PRODUCT_SIZE}px`);
  console.log("");

  console.log("Fetching all products...");
  const products = await getAllProducts();
  console.log(`Found ${products.length} products total.\n`);

  let processed = 0;
  let errors = 0;

  for (const product of products) {
    try {
      await processProduct(product);
      processed++;
    } catch (err) {
      console.log(`SKIP ${product.title}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n===========================================");
  console.log(` Done. ${processed} products processed, ${errors} errors.`);
  console.log("===========================================");
}

main().catch(console.error);
