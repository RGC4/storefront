# Create directories
New-Item -ItemType Directory -Force "src\lib\api" | Out-Null
New-Item -ItemType Directory -Force "src\lib\queries" | Out-Null
New-Item -ItemType Directory -Force "src\components\hero" | Out-Null

# Move shopify.ts from root lib to src\lib if needed
if (Test-Path "lib\shopify.ts") {
    Copy-Item "lib\shopify.ts" "src\lib\shopify.ts" -Force
    Write-Host "Moved lib\shopify.ts to src\lib\shopify.ts"
}

# src\lib\storeConfig.ts
Set-Content "src\lib\storeConfig.ts" -Encoding UTF8 @'
import { headers } from 'next/headers';

export type StoreKey = 'prestige' | 'default';

export type StoreConfig = {
  storeName: string;
  storeKey: StoreKey;
  logo: string;
  heroVideo: string | null;
  heroImage: string;
  heroPoster: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  metaTitle: string;
  metaDescription: string;
};

export function storeKeyFromHost(host: string | null): StoreKey {
  const h = (host ?? '').toLowerCase();
  if (h.includes('prestigeapparelgroup.com')) return 'prestige';
  return 'default';
}

export const STORE_CONFIGS: Record<StoreKey, StoreConfig> = {
  prestige: {
    storeName: 'Prestige Apparel Group',
    storeKey: 'prestige',
    logo: '/assets/prestige/logo.svg',
    heroVideo: '/assets/prestige/hero.mp4',
    heroImage: '/assets/prestige/hero.jpg',
    heroPoster: '/assets/prestige/hero-poster.jpg',
    headline: 'Elevated Essentials',
    subheadline: 'Curated luxury fashion for the modern wardrobe.',
    ctaText: 'Shop Now',
    ctaLink: '#collections',
    metaTitle: 'Prestige Apparel Group',
    metaDescription: 'Luxury fashion curated for the modern wardrobe.',
  },
  default: {
    storeName: 'Prestige Apparel Group',
    storeKey: 'prestige',
    logo: '/assets/prestige/logo.svg',
    heroVideo: '/assets/prestige/hero.mp4',
    heroImage: '/assets/prestige/hero.jpg',
    heroPoster: '/assets/prestige/hero-poster.jpg',
    headline: 'Elevated Essentials',
    subheadline: 'Curated luxury fashion for the modern wardrobe.',
    ctaText: 'Shop Now',
    ctaLink: '#collections',
    metaTitle: 'Prestige Apparel Group',
    metaDescription: 'Luxury fashion curated for the modern wardrobe.',
  },
};

export async function getStoreConfig(): Promise<StoreConfig> {
  const headersList = await headers();
  const host = headersList.get('host');
  const key = storeKeyFromHost(host);
  return STORE_CONFIGS[key];
}
'@
Write-Host "Created src\lib\storeConfig.ts"

# src\lib\shopify.ts
Set-Content "src\lib\shopify.ts" -Encoding UTF8 @'
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
}
if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.SHOPIFY_API_VERSION ?? '2026-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { data, errors } = await shopifyClient.request(query, { variables });
  if (errors) throw new Error(`Shopify API Error: ${JSON.stringify(errors)}`);
  return data as T;
}

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
  options: ShopifyProductOption[];
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: { title: string; handle: string };
    image: ShopifyImage | null;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: { edges: { node: ShopifyCartLine }[] };
};
'@
Write-Host "Created src\lib\shopify.ts"

# src\lib\queries\collections.ts
Set-Content "src\lib\queries\collections.ts" -Encoding UTF8 @'
export const GET_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      image { url altText width height }
      products(first: $first) {
        edges {
          node {
            id title handle description vendor tags
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            images(first: 5) {
              edges { node { url altText width height } }
            }
            variants(first: 50) {
              edges {
                node {
                  id title availableForSale
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
            options { id name values }
          }
        }
      }
    }
  }
`;
'@
Write-Host "Created src\lib\queries\collections.ts"

# src\lib\api\collections.ts
Set-Content "src\lib\api\collections.ts" -Encoding UTF8 @'
import { shopifyFetch, ShopifyCollection } from '../shopify';
import { GET_ALL_COLLECTIONS } from '../queries/collections';

type CollectionsResponse = {
  collections: { edges: { node: ShopifyCollection }[] };
};

export async function getAllCollections(first = 20): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<CollectionsResponse>(GET_ALL_COLLECTIONS, { first });
  return data.collections.edges.map(({ node }) => node);
}
'@
Write-Host "Created src\lib\api\collections.ts"

# src\lib\api\layout.ts
Set-Content "src\lib\api\layout.ts" -Encoding UTF8 @'
import { cache } from 'react';
import type LayoutModel from 'models/Layout.model';
import { getStoreConfig } from '../storeConfig';
import { getAllCollections } from './collections';
import { topbarData, footerData, mobileNavigationData, categoriesData, categoryMenusData } from 'data/layout-data';

export const getLayoutData = cache(async (): Promise<LayoutModel> => {
  const [config, collections] = await Promise.all([
    getStoreConfig(),
    getAllCollections(20),
  ]);

  const navigation = collections.map((c) => ({
    type: 'link' as const,
    title: c.title,
    url: `/furniture-2/collections/${c.handle}`,
    child: [],
  }));

  return {
    footer: {
      ...footerData,
      logo: config.logo,
    },
    header: {
      logo: config.logo,
      categories: categoriesData ?? [],
      categoryMenus: categoryMenusData ?? [],
      navigation,
    },
    topbar: topbarData,
    mobileNavigation: {
      ...mobileNavigationData,
      logo: config.logo,
    },
  } as unknown as LayoutModel;
});
'@
Write-Host "Created src\lib\api\layout.ts"

# src\components\hero\VideoHero.tsx
Set-Content "src\components\hero\VideoHero.tsx" -Encoding UTF8 @'
'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export type VideoHeroProps = {
  heroVideo: string | null;
  heroImage: string;
  heroPoster: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
};

export default function VideoHero({ heroVideo, heroImage, heroPoster, headline, subheadline, ctaText, ctaLink }: VideoHeroProps) {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: '60vh', md: '85vh' }, overflow: 'hidden', bgcolor: 'grey.900' }}>
      {heroVideo ? (
        <video autoPlay muted loop playsInline poster={heroPoster} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <Box component="img" src={heroImage} alt={headline} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', px: { xs: 3, sm: 6, md: 12 } }}>
        <Typography variant="h1" sx={{ color: 'white', fontWeight: 700, mb: 2, maxWidth: 640, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } }}>{headline}</Typography>
        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.88)', mb: 4, maxWidth: 500, fontWeight: 400 }}>{subheadline}</Typography>
        <Button variant="outlined" href={ctaLink} size="large" sx={{ color: 'white', borderColor: 'white', borderWidth: 2, px: 5, py: 1.5, fontSize: '1rem', letterSpacing: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'white' } }}>{ctaText}</Button>
      </Box>
    </Box>
  );
}
'@
Write-Host "Created src\components\hero\VideoHero.tsx"

# Update src\lib\index.ts
$indexContent = Get-Content "src\lib\index.ts" -Raw
if ($indexContent -notmatch "export \* from './shopify'") {
    Add-Content "src\lib\index.ts" "`nexport * from './shopify';"
    Add-Content "src\lib\index.ts" "export * from './storeConfig';"
    Write-Host "Updated src\lib\index.ts"
}

Write-Host ""
Write-Host "All files created. Now run: npm run dev"
