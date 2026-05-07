// src/app/products/[slug]/product-jsonld.tsx
// Server component — renders JSON-LD structured data for Google rich snippets
// This gives you price, availability, brand, and images in search results

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prestigeapparelgroup.com";

interface ProductJsonLdProps {
  product: {
    title: string;
    slug: string;
    description?: string;
    brand?: string | null;
    price: number;
    comparePrice?: number;
    images: string[];
    variants?: { availableForSale?: boolean }[];
  };
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const isAvailable = product.variants?.some((v) => v.availableForSale) ?? true;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} available at ${STORE_NAME}`,
    image: product.images,
    url: `${BASE_URL}/products/${product.slug}`,    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    sku: (product as any).sku ?? undefined,
    category: "Apparel & Accessories > Handbags",
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split("T")[0],
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: STORE_NAME,
      },
      // Imperial dropships from Italy via BrandsGateway.
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
        shippingRate: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 10, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
