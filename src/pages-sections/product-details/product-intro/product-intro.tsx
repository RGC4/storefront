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

/* ── Font stacks ── */
const SERIF = '"Playfair Display", "Didot", "Bodoni Moda", "Bodoni MT", "GFS Didot", serif';
const SANS = '"Helvetica Neue", "Helvetica", "Arial", sans-serif';

export default function ProductIntro({ product }: Props) {
  const { title, brand, price, comparePrice, categories, description } = product;

  const descHtml = (product as any).descriptionHtml || "";
  const descPlain = description || "";
  const hasDescription = descHtml.trim().length > 0 || descPlain.trim().length > 0;

  return (
    <StyledRoot>
      {/* Google Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');`}</style>

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
                    px: 1.4, py: 0.5, fontSize: 10, color: "#888",
                    fontFamily: SANS,
                    background: "#f5f5f3", textTransform: "uppercase",
                    letterSpacing: "0.1em", borderRadius: "2px",
                  }}
                >
                  {item}
                </Box>
              ))}
          </Box>

          {/* BRAND */}
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 }, lineHeight: 1.1, fontWeight: 400,
              fontFamily: SANS,
              color: "#1A1A1A", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {brand ?? ""}
          </Typography>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: { xs: 16, md: 18 }, lineHeight: 1.5, fontWeight: 400,
              fontFamily: SANS,
              color: "#555", mb: 3.5, letterSpacing: "0.01em",
            }}
          >
            {title}
          </Typography>

          <Divider sx={{ borderColor: "#e0e0e0", mb: 3.5 }} />

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
              <Typography sx={{ fontSize: 10, fontFamily: SANS, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}>
                Price
              </Typography>
              <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 400, fontFamily: SANS, color: "#1A1A1A" }}>
                {currency(price)}
              </Typography>
            </Box>

            {comparePrice && comparePrice > 0 ? (
              <Box>
                <Typography sx={{ fontSize: 10, fontFamily: SANS, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}>
                  Est. Retail Price
                </Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 400, fontFamily: SANS, color: "#1A1A1A" }}>
                  {currency(comparePrice)}
                </Typography>
              </Box>
            ) : <Box />}

            {comparePrice && comparePrice > price ? (
              <Box>
                <Typography sx={{ fontSize: 10, fontFamily: SANS, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500 }}>
                  Savings
                </Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 400, fontFamily: SANS, color: "#27ae60" }}>
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
              <Divider sx={{ borderColor: "#e0e0e0", mb: "40px" }} />

              {descHtml ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                  sx={{
                    maxWidth: 580,

                    /* ── Editorial paragraphs — luxury serif ── */
                    fontSize: { xs: 15, md: 16 },
                    lineHeight: 1.8,
                    color: "#1A1A1A",
                    fontFamily: SERIF,
                    letterSpacing: "0.01em",

                    /* ── Paragraph spacing ── */
                    "& p": {
                      mb: "20px",
                      "&:last-child": { mb: 0 },
                    },

                    /* ── Section headers: DETAILS, DIMENSIONS, ORIGIN ── */
                    "& h4": {
                      fontSize: { xs: 11, md: 12 },
                      color: "#1A1A1A",
                      fontWeight: 500,
                      fontFamily: SANS,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      mt: 0,
                      mb: "14px",
                      pt: "36px",
                      borderTop: "1px solid #e0e0e0",
                    },

                    /* ── Spec lists — clean sans-serif ── */
                    "& ul": {
                      listStyle: "none",
                      pl: 0,
                      mb: 0,
                    },
                    "& ul li": {
                      fontSize: { xs: 13, md: 14 },
                      lineHeight: 1.65,
                      color: "#1A1A1A",
                      fontFamily: SANS,
                      fontWeight: 400,
                      py: "4px",
                      pl: "16px",
                      position: "relative",
                      "&::before": {
                        content: '"·"',
                        position: "absolute",
                        left: 0,
                        color: "#999",
                        fontSize: 16,
                        lineHeight: 1.65,
                      },
                    },

                    /* ── Bold text ── */
                    "& strong, & b": {
                      color: "#1A1A1A",
                      fontWeight: 600,
                      fontFamily: SANS,
                    },

                    /* ── Tables (legacy fallback) ── */
                    "& table": {
                      width: "100%",
                      borderCollapse: "collapse",
                      mt: 1,
                      mb: 2,
                    },
                    "& td": {
                      py: 1,
                      fontSize: 14,
                      fontFamily: SANS,
                      borderBottom: "1px solid #f0f0f0",
                      verticalAlign: "top",
                      "&:first-of-type": {
                        color: "#1A1A1A",
                        fontWeight: 500,
                        width: "35%",
                        pr: 2,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontSize: 11,
                      },
                      "&:last-of-type": {
                        color: "#333",
                      },
                    },
                  }}
                />
              ) : (
                /* ── Plain text fallback ── */
                <Typography
                  sx={{
                    maxWidth: 580,
                    fontSize: { xs: 15, md: 16 },
                    lineHeight: 1.8,
                    color: "#1A1A1A",
                    fontFamily: SERIF,
                    whiteSpace: "pre-line",
                  }}
                >
                  {descPlain}
                </Typography>
              )}

              {/* Authenticity badge */}
              <Box
                sx={{
                  mt: "40px",
                  pt: "24px",
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#27ae60",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 10,
                    fontFamily: SANS,
                    color: "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    fontWeight: 500,
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
