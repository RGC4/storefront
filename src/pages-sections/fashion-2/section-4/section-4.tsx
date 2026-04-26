import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ProductCard8 from "components/product-cards/product-card-8";
import ProductsCarousel from "./products-carousel";
import api from "utils/__api__/fashion-2";

export default async function Section4() {
  const products = await api.getProducts();
  if (!products || !products.length) return null;

  return (
    <Box sx={{ pt: 4, pb: 2, px: { xs: 2, md: 5 }, bgcolor: "white" }}>
      <Box sx={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        mb: 3, pb: 1.5, borderBottom: "3px solid #111"
      }}>
        {/* Section heading: was xs:20 md:30 — now xs:16 md:22 (theme h4) */}
        <Typography sx={{
          fontSize: { xs: 16, md: 22 },
          fontWeight: 800,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
        }}>
          Best Selling Products
        </Typography>
        <Link href="/collections/all-bags-over-500" style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#111",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}>
          View All
        </Link>
      </Box>
      <ProductsCarousel>
        {products.map((product) => (
          <ProductCard8 key={product.id} product={product} />
        ))}
      </ProductsCarousel>
    </Box>
  );
}
