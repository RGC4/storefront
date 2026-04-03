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
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ mb: 4 }} />

              {/* Section header */}
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#111",
                  mb: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 700,
                }}
              >
                About This Piece
              </Typography>

              {descHtml ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                  sx={{
                    /* ── Narrative paragraphs ── */
                    fontSize: { xs: 14, md: 15 },
                    lineHeight: 1.9,
                    color: "#444",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    letterSpacing: "0.01em",

                    "& p": {
                      mb: 2.5,
                      "&:last-child": { mb: 0 },
                    },

                    /* ── Bold labels inside descriptions ── */
                    "& strong, & b": {
                      color: "#111",
                      fontWeight: 600,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      fontSize: "0.85em",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    },

                    /* ── Specification tables ── */
                    "& table": {
                      width: "100%",
                      borderCollapse: "collapse",
                      mt: 2,
                      mb: 2,
                      fontSize: 13,
                    },
                    "& td": {
                      py: 1,
                      borderBottom: "1px solid #f0f0f0",
                      verticalAlign: "top",
                      "&:first-of-type": {
                        color: "#111",
                        fontWeight: 600,
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontSize: 11,
                        width: "35%",
                        pr: 2,
                      },
                      "&:last-of-type": {
                        color: "#555",
                      },
                    },

                    /* ── Bulleted lists ── */
                    "& ul": {
                      listStyle: "none",
                      pl: 0,
                      mt: 2,
                      mb: 2,
                    },
                    "& ul li": {
                      py: 0.8,
                      pl: 2,
                      borderBottom: "1px solid #f5f5f5",
                      fontSize: 13,
                      color: "#555",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#ccc",
                        transform: "translateY(-50%)",
                      },
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    },

                    /* ── Heading styles within descriptions ── */
                    "& h3, & h4": {
                      fontSize: 11,
                      color: "#111",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      mt: 3.5,
                      mb: 1.5,
                    },

                    /* ── Dimension callout ── */
                    "& .dimensions, & em": {
                      display: "block",
                      mt: 2,
                      py: 1.5,
                      px: 2,
                      background: "#fafaf8",
                      borderLeft: "3px solid #ddd",
                      fontSize: 13,
                      color: "#666",
                      fontStyle: "normal",
                      lineHeight: 1.7,
                    },
                  }}
                />
              ) : (
                /* ── Plain text fallback ── */
                <Typography
                  sx={{
                    fontSize: { xs: 14, md: 15 },
                    lineHeight: 1.9,
                    color: "#444",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {descPlain}
                </Typography>
              )}

              {/* Authenticity badge */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #eee",
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
                    fontSize: 11,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
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
