import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storefrontQuery } from "lib/shopify";

const COLLECTION_QUERY = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            featuredImage { url }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  }
`;

const PRODUCTS_BY_COLLECTION_ID = `
  query ProductsByCollectionId($id: ID!, $first: Int!) {
    collection(id: $id) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            featuredImage { url }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  }
`;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const data = await storefrontQuery(COLLECTION_QUERY, { handle });
  const collection = data?.collection;
  if (!collection) return notFound();

  let products = collection.products.edges.map((e: any) => e.node);

  // Smart collections return empty via handle query — retry using collection GID
  if (products.length === 0) {
    const fallback = await storefrontQuery(PRODUCTS_BY_COLLECTION_ID, {
      id: collection.id,
      first: 50,
    });
    products = fallback?.collection?.products?.edges?.map((e: any) => e.node) ?? [];
  }

  return (
    <Container sx={{ py: 4 }}>
      <Link
        href="/fashion-2/collections"
        style={{ color: "inherit", fontSize: 14, display: "inline-block", marginBottom: 16 }}
      >
        ← Back to collections
      </Link>

      <Typography variant="h2" sx={{ mb: "2rem" }}>
        {collection.title}
      </Typography>

      {products.length === 0 && (
        <Typography color="text.secondary">No products in this collection.</Typography>
      )}

      <Grid container spacing={3}>
        {products.map((p: any) => (
          <Grid size={{ md: 3, sm: 6, xs: 12 }} key={p.id}>
            <Link
              href={`/products/${p.handle}`}
              style={{ textDecoration: "none", display: "block", color: "inherit" }}
            >
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                {p.featuredImage?.url && (
                  <img
                    src={p.featuredImage.url}
                    alt={p.title}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                  />
                )}
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: "#D23F57", fontWeight: 700 }}>
                    ${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                    <span style={{ fontSize: 12, color: "#999", fontWeight: 400 }}>
                      {p.priceRange.minVariantPrice.currencyCode}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
