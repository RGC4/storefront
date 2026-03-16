<<<<<<< HEAD
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
=======
import Link from "next/link";
// MUI
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";
import ProductVariantSelector from "./product-variant-selector";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { StyledRoot } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ================================================================
type Props = { product: Product };
// ================================================================

export default function ProductIntro({ product }: Props) {
  return (
    <StyledRoot>
      <Grid container spacing={3} justifyContent="space-around">
        {/* IMAGE GALLERY AREA */}
        <Grid size={{ lg: 6, md: 7, xs: 12 }}>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          <ProductGallery images={product.images!} />
        </Grid>

        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
<<<<<<< HEAD

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

          {/* BRAND — 20% bigger: was 32md, now 38md */}
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

          {/* TITLE — 20% bigger: was 18md, now 22md */}
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

          {/* PRICING GRID — 20% bigger: was 22, now 26 */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 2,
              mb: 3.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Price
              </Typography>
              <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#111" }}>
                {currency(price)}
              </Typography>
            </Box>

            {comparePrice > 0 ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Est. Retail Price
                </Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#111" }}>
                  {currency(comparePrice)}
                </Typography>
              </Box>
            ) : <Box />}

            {comparePrice > price ? (
              <Box>
                <Typography sx={{ fontSize: 12, color: "#999", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Savings
                </Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#27ae60" }}>
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

          {/* INLINE DESCRIPTION — 20% bigger: was 14, now 17 */}
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
=======
          <Typography variant="h1">{product.title}</Typography>

          <Typography variant="body1">
            Category: <strong>Bag</strong>
          </Typography>

          <Typography variant="body1">
            Product Code: <strong>ERE238</strong>
          </Typography>

          <Typography variant="body1" fontSize={30} fontWeight={700} sx={{ my: 1 }}>
            $484.00{" "}
            <Typography
              component="span"
              sx={{
                fontSize: 20,
                fontWeight: 600,
                color: "text.secondary",
                textDecoration: "line-through"
              }}
            >
              $550.00
            </Typography>
          </Typography>

          {/* PRODUCT BRAND */}
          {product.brand && (
            <p className="brand">
              Brand: <strong>{product.brand}</strong>
            </p>
          )}

          {/* PRODUCT RATING */}
          <div className="rating">
            <span>Rated:</span>
            <Rating readOnly color="warn" size="small" value={product.rating} />
            <Typography variant="h6">({product.reviews?.length || 0})</Typography>
          </div>

          {/* PRODUCT VARIANTS */}
          <ProductVariantSelector />

          {/* PRICE & STOCK */}
          <div className="price">
            <Typography variant="h2" sx={{ color: "primary.main", mb: 0.5, lineHeight: 1 }}>
              {currency(product.price)}
            </Typography>

            <p>Stock Available</p>
          </div>

          {/* ADD TO CART BUTTON */}
          <AddToCart product={product} />

          {/* SHOP NAME */}
          {product.shop && (
            <p className="shop">
              Sold By:
              <Link href={`/shops/${product.shop.slug}`}>
                <strong>{product.shop.name}</strong>
              </Link>
            </p>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
