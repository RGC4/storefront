"use client";

import Link from "next/link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "models/Product.model";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent
} from "./styles";

type Props = {
  product: Product;
};

export default function ProductCard8({ product }: Props) {
  const {
    title,
    slug,
    thumbnail,
    price,
    compareAtPrice,
    brand,
  } = product as any;

  const discount =
    compareAtPrice && price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : null;

  return (
    <Card>
      <Link href={`/product/${slug}`}>

        <CardHeader>
          {brand && (
            <Typography className="vendor">{brand}</Typography>
          )}
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
            {compareAtPrice && (
              <Typography className="retail-price">
                ${compareAtPrice}
              </Typography>
            )}
            <Typography className="wholesale-price">
              ${price}
            </Typography>
          </Box>
        </CardContent>

      </Link>
    </Card>
  );
}
