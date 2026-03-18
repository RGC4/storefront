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
  const {
    title,
    brand,
    price,
    comparePrice,
    categories,
    description,
  } = product as any;
  return (
    <StyledRoot>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid size={{ lg: 7, md: 7, xs: 12 }}>
          <ProductGallery images={product.images!} />
        </Grid>
        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
          {/* CATEGORY PILLS */}
          <Box sx={{ mb: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {Array.isArray(categories) &&
              categories.slice(0, 4).map((item: string) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.4,
                    py: 0.5,
                    fontSize: 11,
                    color: "#888",
                    background: "#f2f2f2",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderRadius: "3px",
                  }}
                >
                  {item}
                </Box>
              ))}
          </Box>

          {/* BRAND */}
          <Typography
            sx={{
              fontSize: { xs: 30, md: 38 },
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#111",
              mb: 1.5,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {brand || ""}
          </Typography>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: { xs: 18, md: 22 },
              lineHeight: 1.5,
              fontWeight: 400,
              color: "#555",
              mb: 3.5,
            }}
          >
            {title}
          </Typography>

          <Divider sx={{ mb: 3.5 }} />

          {/* PRICING — stacks vertically on mobile, 3 columns on desktop */}
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

            {comparePrice > 0 ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Est. Retail Price
                </Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#111" }}>
                  {currency(comparePrice)}
                </Typography>
              </Box>
            ) : <Box />}

            {comparePrice > price ? (
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

          <Divider sx={{ mb: 3.5 }} />

          {/* DESCRIPTION */}
          {description && (
            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.9,
                color: "#555",
                whiteSpace: "pre-line",
              }}
            >
              {description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
