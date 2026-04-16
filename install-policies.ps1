# install-policies.ps1
# Run from your project root (the folder with package.json)
# Usage: .\install-policies.ps1

$ErrorActionPreference = "Stop"

# Verify we're in the right place
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Run this script from your project root (where package.json is)." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Installing Policy Pages ===" -ForegroundColor Cyan
Write-Host ""

# ─────────────────────────────────────────────
# 1. Create directories
# ─────────────────────────────────────────────
$dirs = @(
    "src/lib",
    "src/components",
    "src/app/privacy-policy",
    "src/app/terms",
    "src/app/return-policy",
    "src/app/shipping-policy",
    "public/assets/stores/s1/policies"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  Created: $d" -ForegroundColor Green
    }
}

# ─────────────────────────────────────────────
# 2. src/lib/policyLoader.ts
# ─────────────────────────────────────────────
Write-Host "  Writing: src/lib/policyLoader.ts" -ForegroundColor Yellow

@'
// src/lib/policyLoader.ts
// Reads policy HTML files from public/assets/stores/{storeId}/policies/
// Extracts structured content for rendering in the site's MUI theme.

import { readFileSync } from "fs";
import { join } from "path";

export interface PolicySection {
  title: string;
  /** HTML string for the section body (paragraphs, lists, etc.) */
  body: string;
}

export interface PolicyData {
  pageTitle: string;
  intro: string;
  sections: PolicySection[];
  footer: string;
}

/**
 * Load and parse a policy HTML file for the current store.
 * @param filename - e.g. "privacy_policy", "refund_policy", "shipping_policy", "terms_conditions"
 */
export function loadPolicy(filename: string): PolicyData {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || "s1";
  const filePath = join(process.cwd(), "public", "assets", "stores", storeId, "policies", `${filename}.html`);

  let html: string;
  try {
    html = readFileSync(filePath, "utf-8");
  } catch {
    return {
      pageTitle: "Policy",
      intro: "This policy page is not yet available.",
      sections: [],
      footer: "",
    };
  }

  // Extract title from <h1>
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
  const pageTitle = h1Match ? stripTags(h1Match[1]) : "Policy";

  // Extract intro - first <p> after <h1> but before any <h2>
  const afterH1 = html.split(/<\/h1>/s)[1] || "";
  const beforeFirstH2 = afterH1.split(/<h2/s)[0] || "";
  const introMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/s);
  const intro = introMatch ? stripTags(introMatch[1]) : "";

  // Extract sections: each <h2> followed by content until the next <h2> or <footer>
  const sections: PolicySection[] = [];
  const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<footer|$)/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const title = stripTags(match[1]).trim();
    const body = match[2]
      .trim()
      .replace(/<\/?div[^>]*>/g, "")
      .trim();
    sections.push({ title, body });
  }

  // Extract footer text
  const footerMatch = html.match(/<footer[^>]*>(.*?)<\/footer>/s);
  const footer = footerMatch ? stripTags(footerMatch[1]).trim() : "";

  return { pageTitle, intro, sections, footer };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
'@ | Set-Content -Path "src/lib/policyLoader.ts" -Encoding UTF8

# ─────────────────────────────────────────────
# 3. src/components/PolicyPage.tsx
# ─────────────────────────────────────────────
Write-Host "  Writing: src/components/PolicyPage.tsx" -ForegroundColor Yellow

@'
// src/components/PolicyPage.tsx
"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import BackButton from "components/BackButton";
import type { PolicyData } from "@/lib/policyLoader";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#b8972e";

interface Props {
  policy: PolicyData;
}

export default function PolicyPage({ policy }: Props) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 } }}>
      <BackButton />

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.6rem" },
          fontWeight: 700,
          textAlign: "center",
          mb: 1,
        }}
      >
        {policy.pageTitle}
      </Typography>

      <Box
        sx={{
          width: 56,
          height: 3,
          backgroundColor: primaryColor,
          mx: "auto",
          mb: 2,
          borderRadius: 2,
        }}
      />

      {policy.intro && (
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "1.15rem",
            maxWidth: 680,
            mx: "auto",
            mb: 6,
            lineHeight: 1.8,
          }}
        >
          {policy.intro}
        </Typography>
      )}

      <Divider sx={{ mb: 5 }} />

      {policy.sections.map((section, i) => (
        <Box key={i} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 1 }}
          >
            {section.title}
          </Typography>

          <Box
            sx={{
              fontSize: "1.15rem",
              color: "text.secondary",
              lineHeight: 1.8,
              "& p": {
                fontSize: "1.15rem",
                color: "text.secondary",
                lineHeight: 1.8,
                mb: 2,
                mt: 0,
              },
              "& ul": {
                pl: 3,
                mt: 1,
              },
              "& li": {
                mb: 1,
                fontSize: "1.15rem",
                color: "text.secondary",
              },
              "& a": {
                color: primaryColor,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        </Box>
      ))}

      <Divider sx={{ my: 5 }} />

      {policy.footer && (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.disabled", pt: 3 }}
        >
          {policy.footer}
        </Typography>
      )}
    </Container>
  );
}
'@ | Set-Content -Path "src/components/PolicyPage.tsx" -Encoding UTF8

# ─────────────────────────────────────────────
# 4. Route pages
# ─────────────────────────────────────────────
Write-Host "  Writing: src/app/privacy-policy/page.tsx" -ForegroundColor Yellow

@'
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Privacy Policy", "How we collect, use, and protect your information.");

export default function PrivacyPolicyPage() {
  const policy = loadPolicy("privacy_policy");
  return <PolicyPage policy={policy} />;
}
'@ | Set-Content -Path "src/app/privacy-policy/page.tsx" -Encoding UTF8

Write-Host "  Writing: src/app/terms/page.tsx" -ForegroundColor Yellow

@'
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Terms and Conditions", "Terms and conditions for using our store.");

export default function TermsPage() {
  const policy = loadPolicy("terms_conditions");
  return <PolicyPage policy={policy} />;
}
'@ | Set-Content -Path "src/app/terms/page.tsx" -Encoding UTF8

Write-Host "  Writing: src/app/return-policy/page.tsx" -ForegroundColor Yellow

@'
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Refund Policy", "Our return and refund guidelines.");

export default function ReturnPolicyPage() {
  const policy = loadPolicy("refund_policy");
  return <PolicyPage policy={policy} />;
}
'@ | Set-Content -Path "src/app/return-policy/page.tsx" -Encoding UTF8

Write-Host "  Writing: src/app/shipping-policy/page.tsx" -ForegroundColor Yellow

@'
import type { Metadata } from "next";
import { storeMetadata } from "@/lib/storeResolver";
import { loadPolicy } from "@/lib/policyLoader";
import PolicyPage from "components/PolicyPage";

export const metadata: Metadata = storeMetadata("Shipping Policy", "Shipping rates, timelines, and delivery information.");

export default function ShippingPolicyPage() {
  const policy = loadPolicy("shipping_policy");
  return <PolicyPage policy={policy} />;
}
'@ | Set-Content -Path "src/app/shipping-policy/page.tsx" -Encoding UTF8

# ─────────────────────────────────────────────
# 5. src/utils/__api__/layout.ts (overwrite)
# ─────────────────────────────────────────────
Write-Host "  Writing: src/utils/__api__/layout.ts (overwrite)" -ForegroundColor Yellow

@'
// src/utils/__api__/layout.ts
import { cache } from "react";
import { storefrontQuery } from "lib/shopify";
import { getStoreConfig } from "@/lib/storeResolver";
import storeConfig from "config/store.config";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const getLayoutData = cache(async () => {
  const { storeId } = getStoreConfig();

  const data = await storefrontQuery(
    `query {
      collections(first: 50, sortKey: TITLE) {
        edges { node { id title handle
          products(first: 1) { edges { node { tags } } }
        } }
      }
    }`,
    {}
  );

  const storeCollections = data.collections.edges
    .filter(({ node }: any) =>
      node.products?.edges?.[0]?.node?.tags?.includes(storeId)
    )
    .map(({ node }: any) => ({
      id: node.id, title: node.title, handle: node.handle,
    }));

  const categoryMenus = storeCollections.map((col: any) => ({
    title: col.title,
    value: col.handle,
  }));

  return {
    collections: storeCollections,

    header: {
      logo: storeConfig.logoHeader || `/assets/stores/${STORE_ID}/logo/logo-header.png`,
      categories: categoryMenus,
      categoryMenus,
      navigation: [],
    },

    footer: {
      logo: storeConfig.logoFooter || `/assets/stores/${STORE_ID}/logo/logo-footer.png`,
      description: storeConfig.footerDescription || "",
      appStoreUrl: "",
      playStoreUrl: "",
      about: [
        { title: "About Us",       url: "/about" },
        { title: "Contact Us",     url: "/contact" },
      ],
      customers: [
        { title: "Track Order",    url: "/order-tracking" },
        { title: "Help Center",    url: "/contact" },
      ],
      policies: [
        { title: "Privacy Policy",       url: "/privacy-policy" },
        { title: "Terms and Conditions", url: "/terms" },
        { title: "Refund Policy",        url: "/return-policy" },
        { title: "Shipping Policy",      url: "/shipping-policy" },
      ],
      socials: storeConfig.social || {
        facebook: "", instagram: "", twitter: "", youtube: "", google: "",
      },
      contact: {
        phone:   storeConfig.phone   || "",
        email:   storeConfig.email   || "",
        address: storeConfig.address || "",
      },
    },

    topbar: {
      title: storeConfig.name || "Store",
      label: "",
      socials: storeConfig.social || {},
      languageOptions: {},
    },

    mobileNavigation: {
      logo: storeConfig.logoHeader || `/assets/stores/${STORE_ID}/logo/logo-header.png`,
      version1: [
        { title: "Home",       icon: "Home",              href: "/",            badge: false },
        { title: "Category",   icon: "CategoryOutlined",  href: "/collections", badge: false },
        { title: "Cart",       icon: "ShoppingBag",       href: "/cart",        badge: true  },
        { title: "Account",    icon: "User2",             href: "/profile",     badge: false },
      ],
      version2: [],
    },
  };
});

export default { getLayoutData };
'@ | Set-Content -Path "src/utils/__api__/layout.ts" -Encoding UTF8

# ─────────────────────────────────────────────
# 6. Copy policy HTML files from local stores folder
# ─────────────────────────────────────────────
$storesSource = "$env:USERPROFILE\Documents\RGC4\shopify\stores"
$policiesDest = "public/assets/stores"

if (Test-Path "$storesSource") {
    # Copy policies for every store folder (s1, s2, s3, etc.)
    Get-ChildItem -Path $storesSource -Directory | ForEach-Object {
        $storeId = $_.Name
        $srcPolicies = Join-Path $_.FullName "policies"
        $destPolicies = Join-Path $policiesDest "$storeId/policies"

        if (Test-Path $srcPolicies) {
            if (-not (Test-Path $destPolicies)) {
                New-Item -ItemType Directory -Path $destPolicies -Force | Out-Null
            }
            Copy-Item -Path "$srcPolicies\*.html" -Destination $destPolicies -Force
            $count = (Get-ChildItem "$destPolicies\*.html").Count
            Write-Host "  Copied: $count policy files -> $destPolicies" -ForegroundColor Green
        } else {
            Write-Host "  Skipped: $storeId (no policies folder found)" -ForegroundColor DarkGray
        }
    }
} else {
    Write-Host ""
    Write-Host "  NOTE: Could not find $storesSource" -ForegroundColor DarkYellow
    Write-Host "  Manually copy your policy HTML files to:" -ForegroundColor DarkYellow
    Write-Host "    public/assets/stores/s1/policies/" -ForegroundColor White
    Write-Host ""
}

# ─────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor White
Write-Host "  src/lib/policyLoader.ts              (NEW)" -ForegroundColor Green
Write-Host "  src/components/PolicyPage.tsx         (NEW)" -ForegroundColor Green
Write-Host "  src/app/privacy-policy/page.tsx       (NEW)" -ForegroundColor Green
Write-Host "  src/app/terms/page.tsx                (NEW)" -ForegroundColor Green
Write-Host "  src/app/return-policy/page.tsx        (NEW)" -ForegroundColor Green
Write-Host "  src/app/shipping-policy/page.tsx      (NEW)" -ForegroundColor Green
Write-Host "  src/utils/__api__/layout.ts           (OVERWRITTEN)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Policy HTML source:" -ForegroundColor White
Write-Host "  public/assets/stores/{storeId}/policies/*.html" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  git add -A" -ForegroundColor Gray
Write-Host "  git commit -m 'Add dynamic policy pages with per-store HTML loading'" -ForegroundColor Gray
Write-Host "  git push" -ForegroundColor Gray
Write-Host ""
