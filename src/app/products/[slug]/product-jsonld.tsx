// src/app/products/[slug]/product-jsonld.tsx
//
// Server component — renders Product JSON-LD structured data for Google rich snippets,
// Pinterest Rich Pins, and Google Shopping eligibility.
//
// All store-specific values come from src/config/store.config.ts (env-driven).

import storeConfig from "config/store.config";

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
  const isAvailable =
    product.variants?.some((v) => v.availableForSale) ?? true;

  const { shipping, returns } = storeConfig;
  const productUrl = `${storeConfig.siteUrl}/products/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description || `${product.title} available at ${storeConfig.name}`,
    image: product.images,
    url: productUrl,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    sku: (product as any).sku ?? undefined,
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      url: productUrl,
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
        name: storeConfig.name,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: shipping.destinationCountry,
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: shipping.rateCurrency,
          value: shipping.rateValue,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.handlingDaysMin,
            maxValue: shipping.handlingDaysMax,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: shipping.transitDaysMin,
            maxValue: shipping.transitDaysMax,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: returns.applicableCountry,
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: returns.daysToReturn,
        returnMethod: `https://schema.org/${returns.returnMethod}`,
        returnFees: `https://schema.org/${returns.returnFee}`,
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