"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import useCart from "hooks/useCart";
import IconLink from "components/icon-link";
import Product from "models/Product.model";

export default function ButtonGroup({ product }: { product: Product }) {
  const [isLoading, setLoading] = useState(false);
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
  };

  return (
    <>
      <Button
        disableElevation
        size="large"
        color="primary"
        variant="contained"
        loading={isLoading}
        disabled={!variantId}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      <IconLink title="View Product Details" url={`/products/${product.slug}`} sx={{ mt: 2 }} />
    </>
  );
}
