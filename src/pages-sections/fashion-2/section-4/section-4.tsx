<<<<<<< HEAD
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ProductCard8 from "components/product-cards/product-card-8";
import ProductsCarousel from "./products-carousel";
=======
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import ProductCard8 from "components/product-cards/product-card-8";
import ProductsCarousel from "./products-carousel";
// API FUNCTIONS
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import api from "utils/__api__/fashion-2";

export default async function Section4() {
  const products = await api.getProducts();
  if (!products || !products.length) return null;

  return (
<<<<<<< HEAD
    <Box sx={{ pt: 4, pb: 2, px: { xs: 2, md: 5 }, bgcolor: "white" }}>
      <Box sx={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        mb: 3, pb: 1.5, borderBottom: "3px solid #111"
      }}>
        <Typography sx={{ fontSize: { xs: 20, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
          Best Selling Products
        </Typography>
        <Link href="/collections" style={{ fontSize: 13, fontWeight: 600, color: "#111", textDecoration: "underline", textUnderlineOffset: 3 }}>
          View All
        </Link>
      </Box>
=======
    <Container className="mt-4">
      <Typography variant="h2" sx={{ mb: "2rem", textAlign: "center" }}>
        Best Selling Product
      </Typography>

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      <ProductsCarousel>
        {products.map((product) => (
          <ProductCard8 key={product.id} product={product} />
        ))}
      </ProductsCarousel>
<<<<<<< HEAD
    </Box>
=======
    </Container>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
