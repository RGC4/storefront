import Link from "next/link";
import { notFound } from "next/navigation";

const STOREFRONT_QUERY = `
  query StorefrontByHandle($handle: String!) {
    metaobject(handle: { type: "storefront", handle: $handle }) {
      fields {
        key
        references(first: 250) {
          nodes {
            __typename
            ... on Collection {
              handle
              title
              image { url }
            }
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

export default async function CollectionsIndex({
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

  const collectionsField = meta.fields.find(
    (f: any) => f.key === "collections"
  );

  const collections =
    collectionsField?.references?.nodes?.filter(
      (n: any) => n.__typename === "Collection"
    ) || [];

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1>Collections</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {collections.map((c: any) => (
          <Link
            key={c.handle}
            href={`/${store}/collections/${c.handle}`}
            style={{
              textDecoration: "none",
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 12,
              color: "inherit",
            }}
          >
            {c.image?.url && (
              <img
                src={c.image.url}
                alt={c.title}
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}
            <div style={{ marginTop: 8, fontWeight: 600 }}>{c.title}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
