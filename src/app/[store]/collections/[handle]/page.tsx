import Link from "next/link";
import { notFound } from "next/navigation";

const COLLECTION_QUERY = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      title
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            featuredImage { url }
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
<<<<<<< HEAD
=======

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  const json = await res.json();
  return json.data;
}

export default async function CollectionPage({
  params,
}: {
<<<<<<< HEAD
  params: Promise<{ store: string; handle: string }>;
}) {
  const { store, handle } = await params;

  const data = await shopifyFetch(COLLECTION_QUERY, { handle });
=======
  params: { store: string; handle: string };
}) {
  const data = await shopifyFetch(COLLECTION_QUERY, {
    handle: params.handle,
  });
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

  const collection = data?.collectionByHandle;
  if (!collection) return notFound();

  const products =
    collection.products.edges
      .map((e: any) => e.node)
      .filter((p: any) => p.availableForSale) || [];

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
<<<<<<< HEAD
      <Link href={`/${store}/collections`}>← Back to collections</Link>
=======
      <Link href={`/${params.store}/collections`}>
        ← Back to collections
      </Link>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

      <h1 style={{ marginTop: 16 }}>{collection.title}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {products.map((p: any) => (
          <Link
            key={p.id}
<<<<<<< HEAD
            href={`/${store}/products/${p.handle}`}
=======
            href={`/${params.store}/products/${p.handle}`}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
            style={{
              textDecoration: "none",
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 12,
              color: "inherit",
            }}
          >
            {p.featuredImage?.url && (
              <img
                src={p.featuredImage.url}
                alt={p.title}
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}
<<<<<<< HEAD
            <div style={{ marginTop: 8, fontWeight: 600 }}>{p.title}</div>
=======
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              {p.title}
            </div>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          </Link>
        ))}
      </div>
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
