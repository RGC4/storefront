# =============================================================
# apply-logo-update.ps1
# Copies the logo from the headless store directory into the
# Next.js public assets folder and updates source files.
#
# Convention:
#   Headless store logos live at:
#   C:\dev\s1\sf - headless stores\{storeId} - {store name}\logo\logo.png
#
#   Public assets land at:
#   public\assets\stores\{storeId}\logo\logo.png
#
# Run from the ROOT of your project: .\apply-logo-update.ps1
# =============================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Fail  { param($msg) Write-Host "[FAIL]  $msg" -ForegroundColor Red }

Info "Starting logo update..."
Info "Project root: $root"

# -----------------------------------------------------------------
# 1. Find the headless store folder for s1 and copy logo.png
# -----------------------------------------------------------------
$headlessStoresDir = Join-Path $root "sf - headless stores"
$storeId           = "s1"

# Find the subfolder that starts with "s1 -"
$storeFolders = Get-ChildItem -Path $headlessStoresDir -Directory | Where-Object { $_.Name -like "$storeId -*" }

if ($storeFolders.Count -eq 0) {
    Fail "Could not find a folder starting with '$storeId -' inside: $headlessStoresDir"
    exit 1
}

$storeFolder = $storeFolders[0].FullName
Info "Found headless store folder: $storeFolder"

$logoSrc  = Join-Path $storeFolder "logo\logo.png"
$logoDest = Join-Path $root "public\assets\stores\$storeId\logo\logo.png"

if (-not (Test-Path $logoSrc)) {
    Fail "Logo not found at: $logoSrc"
    Fail "Make sure logo.png exists in the logo folder of the headless store directory."
    exit 1
}

$logoDir = Split-Path $logoDest
if (-not (Test-Path $logoDir)) {
    New-Item -ItemType Directory -Path $logoDir -Force | Out-Null
    Info "Created directory: $logoDir"
}

Copy-Item -Path $logoSrc -Destination $logoDest -Force
Pass "Logo copied from: $logoSrc"
Pass "Logo copied to:   $logoDest"

# -----------------------------------------------------------------
# 2. Overwrite src/config/store.config.ts
# -----------------------------------------------------------------
$storeConfigPath = Join-Path $root "src\config\store.config.ts"

if (-not (Test-Path (Split-Path $storeConfigPath))) {
    Fail "Directory not found: $(Split-Path $storeConfigPath)"
    exit 1
}

$storeConfigContent = @'
// ============================================================
// STORE CONFIGURATION
// Single source of truth — update these values or set via .env
// ============================================================

const storeConfig = {
  // Store identity
  name:         process.env.NEXT_PUBLIC_STORE_NAME        || "Prestige Apparel Group",
  email:        process.env.NEXT_PUBLIC_STORE_EMAIL       || "info@prestigeapparelgroup.com",
  phone:        process.env.NEXT_PUBLIC_STORE_PHONE       || "+1 (800) 123-4567",
  address:      process.env.NEXT_PUBLIC_STORE_ADDRESS     || "123 Fashion Ave, Toronto, ON M5V 1A1, Canada",

  // Shopify connection
  shopifyDomain:    process.env.SHOPIFY_STORE_DOMAIN                  || "",
  storefrontToken:  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN       || "",
  apiVersion:       process.env.SHOPIFY_API_VERSION                   || "2026-01",

  // Branding
  primaryColor:   process.env.NEXT_PUBLIC_PRIMARY_COLOR   || "#D23F57",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#2B3445",
  logo:           process.env.NEXT_PUBLIC_LOGO_URL        || "/assets/stores/s1/logo/logo.png",

  // Hero section
  storeId:          process.env.NEXT_PUBLIC_STORE_ID           || "s1",
  heroTitle:        process.env.NEXT_PUBLIC_HERO_TITLE         || "New Collection",
  heroSubtitle:     process.env.NEXT_PUBLIC_HERO_SUBTITLE      || "Free shipping on orders over $99",
  heroButtonText:   process.env.NEXT_PUBLIC_HERO_BUTTON_TEXT   || "Shop Now",
  heroButtonLink:   process.env.NEXT_PUBLIC_HERO_BUTTON_LINK   || "/collections",

  // Footer
  footerDescription: process.env.NEXT_PUBLIC_FOOTER_DESCRIPTION ||
    "Your destination for luxury designer bags and fashion. Authentic brands, competitive prices, and exceptional service.",

  social: {
    facebook:  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK  || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter:   process.env.NEXT_PUBLIC_SOCIAL_TWITTER   || "",
    youtube:   process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE   || "",
    google:    "",
  },
};

export default storeConfig;
'@

Set-Content -Path $storeConfigPath -Value $storeConfigContent -Encoding UTF8
Pass "Updated: $storeConfigPath"

# -----------------------------------------------------------------
# 3. Overwrite src/pages-sections/fashion-2/section-1/hero-carousel.tsx
# -----------------------------------------------------------------
$heroPath = Join-Path $root "src\pages-sections\fashion-2\section-1\hero-carousel.tsx"

if (-not (Test-Path (Split-Path $heroPath))) {
    Fail "Directory not found: $(Split-Path $heroPath)"
    exit 1
}

$heroContent = @'
"use client";

import { useEffect, useRef, useState } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const VIDEOS = [
  { src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4` },
  { src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4` },
  { src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4` },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [current]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % VIDEOS.length);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      marginTop: "-52px",
      height: "clamp(300px, 82.6vw, 1322px)",
      overflow: "hidden",
      backgroundColor: "#111",
    }}>
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        muted
        playsInline
        autoPlay
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 15%",
        }}
      >
        <source src={VIDEOS[current].src} type="video/mp4" />
      </video>

      {/* LOGO - upper left, large */}
      <img
        src={`/assets/stores/${STORE_ID}/logo/logo.png`}
        alt="Prestige Apparel Group"
        style={{
          position: "absolute",
          top: 70,
          left: 40,
          zIndex: 10,
          width: 520,
          height: "auto",
          filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6))",
        }}
      />
    </div>
  );
}
'@

Set-Content -Path $heroPath -Value $heroContent -Encoding UTF8
Pass "Updated: $heroPath"

# -----------------------------------------------------------------
# Done
# -----------------------------------------------------------------
Write-Host ""
Pass "Logo update complete! 3 files changed:"
Write-Host "  - public\assets\stores\s1\logo\logo.png                     (copied from headless store)" -ForegroundColor White
Write-Host "  - src\config\store.config.ts                                 (logo path updated)" -ForegroundColor White
Write-Host "  - src\pages-sections\fashion-2\section-1\hero-carousel.tsx   (logo path updated)" -ForegroundColor White
Write-Host ""
Info "Restart your dev server to see the changes."
