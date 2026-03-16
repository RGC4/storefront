<<<<<<< HEAD
import Box from "@mui/material/Box";
import ProductIntro from "../product-intro";
import FrequentlyBought from "../frequently-bought";
import RelatedProducts from "../related-products";
import BackButton from "components/BackButton";
import Product from "models/Product.model";

interface Props {
  product: Product;
  relatedProducts?: Product[];
  frequentlyBought?: Product[];
}

export default function ProductDetailsPageView(props: Props) {
  return (
    <>
      {/* PRODUCT INTRO — constrained width */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1400, mx: "auto" }}>
        <BackButton />
        <ProductIntro product={props.product} />
        {props.frequentlyBought?.length ? (
          <FrequentlyBought products={props.frequentlyBought} />
        ) : null}
      </Box>

      {/* RELATED PRODUCTS — full width, matches home page */}
      {props.relatedProducts?.length ? (
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 6, bgcolor: "#fafafa" }}>
          <RelatedProducts products={props.relatedProducts} />
        </Box>
      ) : null}
    </>
=======
import Container from "@mui/material/Container";
// LOCAL CUSTOM COMPONENTS
import ProductTabs from "../product-tabs";
import ProductIntro from "../product-intro";
import ProductReviews from "../product-reviews";
import AvailableShops from "../available-shops";
import RelatedProducts from "../related-products";
import FrequentlyBought from "../frequently-bought";
import ProductDescription from "../product-description";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
interface Props {
  product: Product;
  relatedProducts: Product[];
  frequentlyBought: Product[];
}
// ==============================================================

export default function ProductDetailsPageView(props: Props) {
  return (
    <Container className="mt-2 mb-2">
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro product={props.product} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs description={<ProductDescription />} reviews={<ProductReviews />} />

      {/* FREQUENTLY BOUGHT PRODUCTS AREA */}
      <FrequentlyBought products={props.frequentlyBought} />

      {/* AVAILABLE SHOPS AREA */}
      <AvailableShops />

      {/* RELATED PRODUCTS AREA */}
      <RelatedProducts products={props.relatedProducts} />
    </Container>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
