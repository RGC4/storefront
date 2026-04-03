import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";
import ProductVariantSelector from "./product-variant-selector";
import { currency } from "lib";
import { StyledRoot } from "./styles";
import Product from "models/Product.model";

type Props = { product: Product };

export default function ProductIntro({ product }: Props) {
  const { title, brand, price, comparePrice, categories, description } = product;

  const descHtml = (product as any).descriptionHtml || "";
  const descPlain = description || "";
  const hasDescription = descHtml.trim().length > 0 || descPlain.trim().length > 0;

  return (
    <StyledRoot>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid size={{ lg: 7, md: 7, xs: 12 }}>
          <ProductGallery images={product.images} />
        </Grid>
        <Grid size={{ lg: 5, md: 5, xs: 12 }}>

          {/* CATEGORY PILLS */}
          <Box sx={{ mb: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {Array.isArray(categories) &&
              categories.slice(0, 4).map((item: string) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.4, py: 0.5, fontSize: 11, color: "#888",
                    background: "#f2f2f2", textTransform: "uppercase",
                    letterSpacing: "0.08em", borderRadius: "3px",
                  }}
                >
                  {item}
                </Box>
              ))}
          </Box>

          {/* BRAND */}
          <Typography
            sx={{
              fontSize: { xs: 30, md: 38 }, lineHeight: 1.1, fontWeight: 800,
              color: "#111", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.04em",
            }}
          >
            {brand ?? ""}
          </Typography>

          {/* TITLE */}
          <Typography sx={{ fontSize: { xs: 18, md: 22 }, lineHeight: 1.5, fontWeight: 400, color: "#555", mb: 3.5 }}>
            {title}
          </Typography>

          <Divider sx={{ mb: 3.5 }} />

          {/* PRICING */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: { xs: 1.5, sm: 2 },
              mb: 3.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Price
              </Typography>
              <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#111" }}>
                {currency(price)}
              </Typography>
            </Box>

            {comparePrice && comparePrice > 0 ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Est. Retail Price
                </Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#111" }}>
                  {currency(comparePrice)}
                </Typography>
              </Box>
            ) : <Box />}

            {comparePrice && comparePrice > price ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Savings
                </Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#27ae60" }}>
                  {currency(comparePrice - price)}
                </Typography>
              </Box>
            ) : <Box />}
          </Box>

          {/* VARIANT SELECTOR */}
          <Box sx={{ mb: 3.5 }}>
            <ProductVariantSelector product={product} />
          </Box>

          {/* ADD TO CART */}
          <Box sx={{ mb: 3.5 }}>
            <AddToCart product={product} />
          </Box>

          {/* ═══ DESCRIPTION ═══ */}
          {hasDescription && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 5 }} />

              {descHtml ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                  sx={{
                    /* ── Body text ── */
                    fontSize: { xs: 15, md: 16.5 },
                    lineHeight: 2,
                    color: "#3a3a3a",
                    letterSpacing: "0.015em",

                    /* ── Paragraphs ── */
                    "& p": {
                      mb: 3.5,
                      "&:last-child": { mb: 0 },
                    },

                    /* ── Section headers (Details, Dimensions) ── */
                    "& h4": {
                      fontSize: { xs: 14, md: 15 },
                      color: "#111",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      mt: 0,
                      mb: 2.5,
                      pt: 4,
                      borderTop: "1px solid #e8e8e8",
                    },

                    /* ── Bullet lists ── */
                    "& ul": {
                      listStyle: "disc",
                      pl: 2.5,
                      mb: 0,
                    },
                    "& ul li": {
                      fontSize: { xs: 14, md: 15.5 },
                      lineHeight: 1.6,
                      color: "#444",
                      py: 0.6,
                      pl: 0.5,
                    },

                    /* ── Bold text ── */
                    "& strong, & b": {
                      color: "#111",
                      fontWeight: 700,
                    },

                    /* ── Tables (fallback for older descriptions) ── */
                    "& table": {
                      width: "100%",
                      borderCollapse: "collapse",
                      mt: 1,
                      mb: 2,
                    },
                    "& td": {
                      py: 1.2,
                      fontSize: { xs: 14, md: 15 },
                      borderBottom: "1px solid #f0f0f0",
                      verticalAlign: "top",
                      "&:first-of-type": {
                        color: "#111",
                        fontWeight: 600,
                        width: "35%",
                        pr: 2,
                      },
                      "&:last-of-type": {
                        color: "#444",
                      },
                    },
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: { xs: 15, md: 16.5 },
                    lineHeight: 2,
                    color: "#3a3a3a",
                    whiteSpace: "pre-line",
                  }}
                >
                  {descPlain}
                </Typography>
              )}

              {/* Authenticity badge */}
              <Box
                sx={{
                  mt: 5,
                  pt: 3.5,
                  borderTop: "1px solid #e8e8e8",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#27ae60",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                  }}
                >
                  Authenticity Guaranteed
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
