<<<<<<< HEAD
// DESTINATION: lib/shopify.ts

export async function storefrontQuery(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN as string;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;
=======
export async function storefrontQuery(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN as string;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  const version = process.env.SHOPIFY_API_VERSION || "2026-01";
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
<<<<<<< HEAD
    cache: "no-store",
  } as RequestInit);
  const json = await res.json();
  if (json.errors) {
    console.error("Shopify API error:", JSON.stringify(json.errors));
    return {};
  }
  return json.data;
}

// Cart mutations must never be cached — always fetch fresh
async function storefrontMutation(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN as string;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;
  const version = process.env.SHOPIFY_API_VERSION || "2026-01";
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = await res.json();
  if (json.errors) {
    console.error("Shopify API error:", JSON.stringify(json.errors));
    return {};
  }
=======
    next: { revalidate: 60 },
  } as RequestInit);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "Shopify API error");
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  return json.data;
}

export async function shopifyCreateCart() {
<<<<<<< HEAD
  const data = await storefrontMutation(
=======
  const data = await storefrontQuery(
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    `mutation {
      cartCreate {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }`
  );
<<<<<<< HEAD
  return data?.cartCreate?.cart as { id: string; checkoutUrl: string };
}

export async function shopifyAddToCart(cartId: string, merchandiseId: string, quantity: number) {
  const data = await storefrontMutation(
=======
  return data.cartCreate.cart as { id: string; checkoutUrl: string };
}

export async function shopifyAddToCart(cartId: string, merchandiseId: string, quantity: number) {
  const data = await storefrontQuery(
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ merchandiseId, quantity }] }
  );
<<<<<<< HEAD

  // Log any userErrors so we can see if Shopify rejected the add
  const userErrors = data?.cartLinesAdd?.userErrors;
  if (userErrors?.length) {
    console.error("Shopify cartLinesAdd userErrors:", JSON.stringify(userErrors));
  }

  return data?.cartLinesAdd?.cart;
}

export async function shopifyUpdateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontMutation(
=======
  return data.cartLinesAdd.cart;
}

export async function shopifyUpdateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontQuery(
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
<<<<<<< HEAD
  return data?.cartLinesUpdate?.cart;
}

export async function shopifyRemoveCartLine(cartId: string, lineId: string) {
  const data = await storefrontMutation(
=======
  return data.cartLinesUpdate.cart;
}

export async function shopifyRemoveCartLine(cartId: string, lineId: string) {
  const data = await storefrontQuery(
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    `mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      handle
                      images(first: 1) { edges { node { url } } }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] }
  );
<<<<<<< HEAD
  return data?.cartLinesRemove?.cart;
}

// FIX: Use storefrontQuery (not storefrontMutation) for a read-only query
=======
  return data.cartLinesRemove.cart;
}

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
export async function shopifyGetCart(cartId: string) {
  const data = await storefrontQuery(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    handle
                    images(first: 1) { edges { node { url } } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { cartId }
  );
<<<<<<< HEAD
  return data?.cart;
}
=======
  return data.cart;
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
