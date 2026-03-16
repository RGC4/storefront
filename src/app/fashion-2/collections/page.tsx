import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import api from "utils/__api__/fashion-2";

export default async function CollectionsPage() {
  const collections = await api.getCategories();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: "2rem", textAlign: "center" }}>
        All Collections
      </Typography>

      <Grid container spacing={3}>
        {collections.map((c) => (
          <Grid size={{ md: 3, sm: 6, xs: 12 }} key={c.id}>
            <Link
              href={`/fashion-2/collections/${c.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                  />
                )}
                <div style={{ padding: "12px 16px", fontWeight: 600, fontSize: 15 }}>
                  {c.name}
                </div>
              </div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
