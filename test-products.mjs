import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envVars = {};
const lines = readFileSync(envPath, "utf8").split("\n");
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  envVars[key] = val;
}

const domain = envVars.SHOPIFY_STORE_DOMAIN;
const token = envVars.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = envVars.SHOPIFY_API_VERSION || "2026-01";
const url = "https://" + domain + "/api/" + version + "/graphql.json";

async function query(q, vars = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: q, variables: vars }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// 1. Check products
console.log("\n--- Products (first 5) ---");
const prodData = await query(`{
  products(first: 5, sortKey: BEST_SELLING) {
    edges {
      node {
        id
        title
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 3) {
          edges { node { id title availableForSale } }
        }
        images(first: 1) { edges { node { url } } }
      }
    }
  }
}`);

const products = prodData.products.edges;
if (products.length === 0) {
  console.log("⚠️  No products found in store");
} else {
  console.log("✅", products.length, "products found");
  for (const { node: p } of products) {
    const price = p.priceRange.minVariantPrice;
    const variantId = p.variants.edges[0]?.node.id;
    console.log("\n  Title:      ", p.title);
    console.log("  Handle:     ", p.handle);
    console.log("  Price:      ", price.amount, price.currencyCode);
    console.log("  Variant ID: ", variantId || "NONE");
    console.log("  In Stock:   ", p.variants.edges[0]?.node.availableForSale ?? "unknown");
    console.log("  Image:      ", p.images.edges[0]?.node.url ? "✅" : "⚠️  no image");
  }
}

// 2. Check collections
console.log("\n--- Collections (first 10) ---");
const colData = await query(`{
  collections(first: 10) {
    edges {
      node { id title handle }
    }
  }
}`);

const collections = colData.collections.edges;
if (collections.length === 0) {
  console.log("⚠️  No collections found");
} else {
  console.log("✅", collections.length, "collections found");
  for (const { node: c } of collections) {
    console.log("  -", c.handle, "|", c.title);
  }
}

// 3. Test cart creation
console.log("\n--- Cart Creation Test ---");
const cartData = await query(`mutation { cartCreate { cart { id checkoutUrl } userErrors { field message } } }`);
const cart = cartData.cartCreate.cart;
const cartErrors = cartData.cartCreate.userErrors;

if (cartErrors.length > 0) {
  console.log("❌ Cart creation errors:", cartErrors);
} else {
  console.log("✅ Cart created");
  console.log("  Cart ID:      ", cart.id);
  console.log("  Checkout URL: ", cart.checkoutUrl);
}

// 4. If we have a product, test adding to cart
if (products.length > 0 && cart) {
  const variantId = products[0].node.variants.edges[0]?.node.id;
  if (variantId) {
    console.log("\n--- Add to Cart Test ---");
    const addData = await query(`
      mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
            lines(first: 5) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price { amount currencyCode }
                      product { title }
                    }
                  }
                }
              }
            }
            checkoutUrl
          }
          userErrors { field message }
        }
      }
    `, { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity: 1 }] });

    const updatedCart = addData.cartLinesAdd.cart;
    const addErrors = addData.cartLinesAdd.userErrors;

    if (addErrors.length > 0) {
      console.log("❌ Add to cart errors:", addErrors);
    } else {
      console.log("✅ Item added to cart");
      console.log("  Total items:", updatedCart.totalQuantity);
      const line = updatedCart.lines.edges[0]?.node;
      if (line) {
        console.log("  Product:    ", line.merchandise.product.title);
        console.log("  Variant:    ", line.merchandise.title);
        console.log("  Price:      ", line.merchandise.price.amount, line.merchandise.price.currencyCode);
      }
      console.log("  Checkout URL:", updatedCart.checkoutUrl);
    }
  }
}

console.log("\n--- Summary ---");
console.log("Products available:  ", products.length > 0 ? "✅" : "❌");
console.log("Collections available:", collections.length > 0 ? "✅" : "❌");
console.log("Cart create works:   ", cart ? "✅" : "❌");
