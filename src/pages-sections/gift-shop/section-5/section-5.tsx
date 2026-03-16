import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import ProductCard6 from "components/product-cards/product-card-6";
import ProductsCarousel from "./products-carousel";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// =========================================================
type Props = { title: string; products: Product[] };
  return (
    <div className="mt-2">
      <Typography variant="h2" sx={{ mb: 3, lineHeight: 1 }}>
        {title}
      </Typography>

      <ProductsCarousel>
        {products.map((product) => (
          <div className="pb-1" key={product.id}>
            <ProductCard6 product={product} />
          </div>
        ))}
      </ProductsCarousel>
    </div>
  );
}
