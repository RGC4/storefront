<<<<<<< HEAD
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

        {/* NAME ABOVE IMAGE */}
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
=======
import Link from "next/link";
import Rating from "@mui/material/Rating";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
// LOCAL CUSTOM COMPONENTS
import HoverActions from "./hover-actions";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
// STYLED COMPONENTS
import { Card, CardMedia, CardContent } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function ProductCard8({ product }: Props) {
  const { slug, title, price, thumbnail, categories, reviews, rating } = product;

  return (
    <Card>
      <CardMedia>
        <Link href={`/products/${slug}`}>
          <LazyImage
            width={300}
            height={300}
            src={thumbnail}
            alt="category"
            className="product-img"
          />
        </Link>

        <HoverActions product={product} />
      </CardMedia>

      <CardContent>
        {/* PRODUCT CATEGORY */}
        {categories.length > 0 ? <p className="category">{categories[0]}</p> : null}

        {/* PRODUCT TITLE / NAME */}
        <p className="title">{title}</p>

        {/* PRODUCT PRICE */}
        <h4 className="price">{currency(price)}</h4>

        {/* PRODUCT RATING / REVIEW */}
        <div className="ratings">
          <Rating readOnly value={rating} sx={{ fontSize: 16 }} />
          <p className="total">({reviews?.length || 0} Reviews)</p>
        </div>
      </CardContent>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    </Card>
  );
}
