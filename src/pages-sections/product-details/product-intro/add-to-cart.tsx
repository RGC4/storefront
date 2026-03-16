// DESTINATION: src/pages-sections/product-details/product-intro/add-to-cart.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import useCart from "hooks/useCart";
import Product from "models/Product.model";

type Props = { product: Product };

export default function AddToCart({ product }: Props) {
  const { variants } = product;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const { addToCart } = useCart();

  // Find the variant whose selectedOptions all match the current URL params.
  // Falls back to the first available variant for single-variant products.
  const selectedVariant = (() => {
    const allVariants = (variants as any[]) ?? [];

    // If no search params are set yet, use first available
    if (searchParams.size === 0) {
      return allVariants.find((v) => v.availableForSale) ?? allVariants[0];
    }

    const match = allVariants.find((v) =>
      (v.selectedOptions ?? []).every(
        (opt: { name: string; value: string }) =>
          searchParams.get(opt.name.toLowerCase()) === opt.value
      )
    );

    return match ?? allVariants.find((v) => v.availableForSale) ?? allVariants[0];
  })();

  const variantId = selectedVariant?.id ?? "";
  const isAvailable = selectedVariant?.availableForSale ?? false;

  const handleAddToCart = async () => {
    // Guard against adding unavailable items — prevents qty 0 in cart
    if (!variantId || !isAvailable) return;
    setLoading(true);
    try {
      await addToCart(variantId, 1);
      router.push("/mini-cart", { scroll: false });
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="primary"
      variant="contained"
      loading={isLoading}
      disabled={!variantId || !isAvailable}
      onClick={handleAddToCart}
      sx={{ mb: 4.5, px: "1.75rem", height: 40 }}
    >
      {isAvailable ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
