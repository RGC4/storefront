"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Product from "models/Product.model";

export default function ProductVariantSelector({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!product?.variants?.length) return null;

  const optionMap = new Map<string, string[]>();
  for (const variant of product.variants as any[]) {
    for (const opt of variant.selectedOptions ?? []) {
      // Skip Shopify's default placeholder variant
      if (opt.name === "Title" && opt.value === "Default Title") continue;
      if (!optionMap.has(opt.name)) optionMap.set(opt.name, []);
      const vals = optionMap.get(opt.name)!;
      if (!vals.includes(opt.value)) vals.push(opt.value);
    }
  }

  if (optionMap.size === 0) return null;

  return (
    <>
      {Array.from(optionMap.entries()).map(([name, values]) => {
        const nameLower = name.toLowerCase();
        return (
          <div className="mb-1" key={name}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {name}
            </Typography>
            <div className="variant-group">
              {values.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  color="primary"
                  variant={searchParams.get(nameLower) === value ? "filled" : "outlined"}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set(nameLower, value);
                    router.push(`${pathname}?${params}`, { scroll: false });
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
