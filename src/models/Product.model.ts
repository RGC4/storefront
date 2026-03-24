import Shop from "./Shop.model";
import Review from "./Review.model";

export default interface Product {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  price: number;
  comparePrice?: number;      // our wholesale compare price
  compareAtPrice?: number;    // Shopify field alias (same value, different name)
  discount: number;
  thumbnail: string;
  images: string[];
  colors?: string[];
  size?: string[];
  status?: string;
  unit?: string;
  rating: number;
  description?: string;
  categories: string[];
  published?: boolean;
  shop?: Shop;
  reviews?: Review[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode?: string };
  selectedOptions?: { name: string; value: string }[];
}
