import Image from "next/image";
import { notFound } from "next/navigation";

const STOREFRONT_QUERY = `
  query StorefrontByHandle($handle: String!) {
    metaobject(handle: { type: "storefront", handle: $handle }) {
      handle
      fields {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            image { url }
          }
        }
      }
    }
  }
`;

async function shopifyFetch(query: string, variables?: any) {
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );
  const json = await res.json();
  return json.data;
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const { store } = await params;

  const data = await shopifyFetch(STOREFRONT_QUERY, {
    handle: store,
  });

  const meta = data?.metaobject;
  if (!meta) return notFound();

  const heroField = meta.fields.find((f: any) => f.key === "hero_image");
  const heroImage =
    heroField?.reference?.__typename === "MediaImage"
      ? heroField.reference.image.url
      : null;

  const headline =
    meta.fields.find((f: any) => f.key === "hero_headline")?.value || store;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {heroImage && (
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          <Image
            src={heroImage}
            alt={headline}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <h1 style={{ marginTop: 24 }}>{headline}</h1>
    </main>
  );
}
