<<<<<<< HEAD
"use client";

import { Fragment } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import FrequentlyProductCard from "./frequently-product-card";
import { currency } from "lib";
import Product from "models/Product.model";
import { Icon, StyledRoot, TotalCount } from "./styles";
import useCart from "hooks/useCart";

type Props = { products: Product[] };

export default function FrequentlyBought({ products }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();

  if (!products || !products.length) return null;

  const limited = products.slice(0, 3);
  const total = limited.reduce((sum, p) => sum + p.price, 0);
  const totalCompare = limited.reduce((sum, p) => sum + (p.comparePrice || p.price), 0);
  const savings = totalCompare - total;

  const handleAddToCart = async () => {
    try {
      for (const product of limited) {
        const variantId = (product.variants as any)?.find((v: any) => v.availableForSale)?.id ?? (product.variants as any)?.[0]?.id;
        if (variantId) await addToCart(variantId, 1);
      }
      enqueueSnackbar("All items added to cart", { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to add items to cart", { variant: "error" });
    }
  };

  return (
    <StyledRoot>
      <Typography variant="h3" sx={{ mb: 3 }}>Frequently Bought Together</Typography>
      <div className="content-wrapper">
        {limited.map((item, ind) => (
          <Fragment key={item.id}>
            <FrequentlyProductCard id={item.id} slug={item.slug} price={item.price} title={item.title} imgUrl={item.thumbnail} />
            {ind < limited.length - 1 && <Icon>+</Icon>}
          </Fragment>
        ))}
        <Icon>=</Icon>
        <TotalCount>
          <Typography variant="h3" color="primary">{currency(total)}</Typography>
          {savings > 0 && <Typography component="span" sx={{ mb: 2, fontWeight: 600, color: "grey.600" }}>Save {currency(savings)}</Typography>}
          <div className="btn-wrapper">
            <Button variant="contained" color="primary" onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="outlined" color="primary" onClick={() => enqueueSnackbar("Added to wishlist", { variant: "success" })}>Add to List</Button>
=======
import { Fragment } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENT
import FrequentlyProductCard from "./frequently-product-card";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
// STYLED COMPONENTS
import { Icon, StyledRoot, TotalCount } from "./styles";

// ============================================================
type Props = { products: Product[] };
// ============================================================

export default function FrequentlyBought({ products }: Props) {
  // IF NO PRODUCTS RETURN NULL
  if (!products || !products.length) return null;

  return (
    <StyledRoot>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Frequently Bought Together
      </Typography>

      <div className="content-wrapper">
        {products.map((item, ind) => (
          <Fragment key={item.id}>
            <FrequentlyProductCard
              id={item.id}
              key={item.id}
              slug={item.slug}
              price={item.price}
              title={item.title}
              imgUrl={item.thumbnail}
            />

            {ind < products.length - 1 && <Icon>+</Icon>}
          </Fragment>
        ))}

        <Icon>=</Icon>

        <TotalCount>
          <Typography variant="h3" color="primary">
            {currency(2500)}
          </Typography>

          <Typography component="span" sx={{ mb: 2, fontWeight: "600", color: "grey.600" }}>
            Save {currency(500)}
          </Typography>

          <div className="btn-wrapper">
            <Button variant="contained" color="primary">
              Add to Cart
            </Button>

            <Button variant="outlined" color="primary">
              Add to List
            </Button>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          </div>
        </TotalCount>
      </div>
    </StyledRoot>
  );
}
