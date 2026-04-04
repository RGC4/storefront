import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Product from "models/Product.model";

type Props = { products: Product[] };

export default function RelatedProducts({ products }: Props) {
  if (!products?.length) return null;

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        mb: 3, pb: 1.5, borderBottom: "3px solid #111",
      }}>
        <Typography sx={{ fontSize: { xs: 16, md: 22 }, fontWeight: 800, letterSpacing: "-0.01em", textTransform: "uppercase" }}>
          You May Also Like
        </Typography>
      </Box>

      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
        gap: { xs: 2, md: 3 },
      }}>
        {products.slice(0, 8).map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{
              bgcolor: "white", border: "1px solid #e8e8e8",
              transition: "all 0.2s ease", overflow: "hidden", cursor: "pointer",
              display: "flex", flexDirection: "column",
              "&:hover": { borderColor: "#aaa", boxShadow: "0 6px 24px rgba(0,0,0,0.09)", transform: "translateY(-2px)" },
            }}>
              <Box sx={{
                px: "12px", pt: "14px", pb: "14px", borderBottom: "1px solid #f0f0f0",
                textAlign: "center", minHeight: 90, flexShrink: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                {product.brand && (
                  <Typography sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: "0.08em", mb: "4px" }}>
                    {product.brand}
                  </Typography>
                )}
                <Typography sx={{
                  fontSize: { xs: 12, md: 13 }, fontWeight: 400, color: "#666", lineHeight: 1.4,
                  overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", textAlign: "center",
                }}>
                  {product.title}
                </Typography>
              </Box>
              <Box sx={{
                width: "100%",
                aspectRatio: "1 / 1",
                flexShrink: 0,
                overflow: "hidden",
              }}>
                {product.thumbnail && (
                  <img src={product.thumbnail} alt={product.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                )}
              </Box>
              <Box sx={{ px: "14px", py: "10px", borderTop: "1px solid #f0f0f0", textAlign: "center", flexShrink: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <Typography sx={{ fontSize: 13, color: "#999", textDecoration: "line-through" }}>
                      ${Number(product.compareAtPrice).toFixed(2)}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#111" }}>
                    ${Number(product.price).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
