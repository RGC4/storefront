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
  );
}
