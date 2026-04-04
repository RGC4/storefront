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

  return (
    <StyledRoot>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid size={{ lg: 7, md: 7, xs: 12 }}>
          <ProductGallery images={product.images} />
        </Grid>
        <Grid size={{ lg: 5, md: 5, xs: 12 }}>

          {/* BRAND */}
          <Typography
            sx={{
              fontSize: { xs: 17, md: 19 }, lineHeight: 1.1, fontWeight: 700,
              color: "#111", mb: 1, textTransform: "uppercase", letterSpacing: "0.08em",
            }}
          >
            {brand ?? ""}
          </Typography>

          {/* TITLE */}
          <Typography sx={{ fontSize: { xs: 14, md: 16 }, lineHeight: 1.4, fontWeight: 400, color: "#666", mb: 3.5 }}>
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
              <Typography sx={{ fontSize: 13, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                Price
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#111" }}>
                {currency(price)}
              </Typography>
            </Box>

            {comparePrice && comparePrice > 0 ? (
              <Box>
                <Typography sx={{ fontSize: 13, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Est. Retail Price
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 400, color: "#999", textDecoration: "line-through" }}>
                  {currency(comparePrice)}
                </Typography>
              </Box>
            ) : <Box />}

            {comparePrice && comparePrice > price ? (
              <Box>
                <Typography sx={{ fontSize: 13, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  Savings
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#c41230" }}>
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
          {(product as any).descriptionHtml ? (
            <Box
              dangerouslySetInnerHTML={{ __html: (product as any).descriptionHtml }}
              sx={{
                fontSize: 16, lineHeight: 1.6, color: "#666",
                "& p": { mb: 1.5, "&:last-child": { mb: 0 } },
                "& h4": { fontSize: 16, fontWeight: 700, color: "#111", mt: 2.5, mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" },
                "& ul": { listStyle: "disc", pl: 2.5, mb: 1 },
                "& ul li": { fontSize: 16, lineHeight: 1.6, color: "#666", py: 0.2 },
                "& strong, & b": { color: "#333", fontWeight: 700 },
              }}
            />
          ) : description ? (
            <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: "#666", whiteSpace: "pre-line" }}>
              {description}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
