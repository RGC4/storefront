"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
<<<<<<< HEAD
import useCart from "hooks/useCart";
import IconLink from "components/icon-link";
=======

import useCart from "hooks/useCart";
import IconLink from "components/icon-link";

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import Product from "models/Product.model";

export default function ButtonGroup({ product }: { product: Product }) {
  const [isLoading, setLoading] = useState(false);
<<<<<<< HEAD
  const { addToCart } = useCart();

  const variantId =
    (product.variants as any)?.find((v: any) => v.availableForSale)?.id ??
    (product.variants as any)?.[0]?.id ??
    "";

  const handleAddToCart = async () => {
    if (!variantId) return;
    setLoading(true);
    try {
      await addToCart(variantId, 1);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
=======
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    setLoading(true);

    setTimeout(() => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: { ...product, qty: 1 }
      });

      setLoading(false);
    }, 500);
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  };

  return (
    <>
      <Button
        disableElevation
        size="large"
        color="primary"
        variant="contained"
        loading={isLoading}
<<<<<<< HEAD
        disabled={!variantId}
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      <IconLink title="View Product Details" url={`/products/${product.slug}`} sx={{ mt: 2 }} />
    </>
  );
}
