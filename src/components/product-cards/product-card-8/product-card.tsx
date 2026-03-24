"use client";

import Link from "next/link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "models/Product.model";
import { Card, CardHeader, CardMedia, CardContent } from "./styles";

type Props = { product: Product };

export default function ProductCard8({ product }: Props) {
  const { title, slug, thumbnail, price, compareAtPrice, comparePrice, brand } = product;

  // Support both field names from Shopify mapper
  const retailPrice = compareAtPrice ?? comparePrice;

  const discount =
    retailPrice && retailPrice > price
      ? Math.round((1 - price / retailPrice) * 100)
      : null;

  return (
    <Card>
      <Link href={`/product/${slug}`}>
        <CardHeader>
          {brand && <Typography className="vendor">{brand}</Typography>}
          <Typography className="title">{title}</Typography>
        </CardHeader>

        <CardMedia>
          <img src={thumbnail} alt={title} />
          {discount && (
            <Box className="discount-badge">{discount}% OFF</Box>
          )}
        </CardMedia>

        <CardContent>
          <Box className="price-block">
            {retailPrice && retailPrice > price && (
              <Typography className="retail-price">
                ${retailPrice.toFixed(2)}
              </Typography>
            )}
            <Typography className="wholesale-price">
              ${price.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
}
