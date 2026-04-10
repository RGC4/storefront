# ============================================================
# install-mobile-polish.ps1
# ============================================================
# Comprehensive mobile polish for the fashion-2 homepage.
# Fixes the "everything is huge on mobile" problem across
# hero, product carousels, product cards, and category tiles.
#
# WHAT THIS FIXES
#   1. hero-carousel.tsx
#      - Fixed 4:5 portrait container (no vh jumping)
#      - Auto-rotating poster images on mobile
#      - Right-sized mobile typography
#
#   2. section-4/products-carousel.tsx  (Best Selling)
#      - Mobile shows 2 cards instead of 1 giant card
#      - Tighter slide spacing
#
#   3. section-6/products-carousel.tsx  (New Arrivals)
#      - Same 2-card fix
#
#   4. product-card-8/styles.ts
#      - Tighter mobile header, smaller text, smaller prices
#      - Cards feel compact and browsable at 2-up
#
#   5. section-3/section-3-client.tsx
#      - Shorter category tile height on mobile (200 -> 140)
#
# Backs up every file it touches with a timestamp.
# Desktop is untouched across the board.
#
# USAGE
#   .\install-mobile-polish.ps1           (writes only)
#   .\install-mobile-polish.ps1 -DryRun   (shows what it would do)
#   .\install-mobile-polish.ps1 -Commit -Push
# ============================================================

[CmdletBinding()]
param(
    [switch]$Commit,
    [switch]$Push,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Info ($msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Write-Ok   ($msg) { Write-Host "+ $msg" -ForegroundColor Green }
function Write-Warn ($msg) { Write-Host "! $msg" -ForegroundColor Yellow }
function Write-Fail ($msg) { Write-Host "X $msg" -ForegroundColor Red }
function Write-Head ($msg) { Write-Host ""; Write-Host "-- $msg --" -ForegroundColor White }

Write-Host ""
Write-Host "=== Mobile Polish Installer ===" -ForegroundColor White
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Fail "No package.json found. Run this from your repo root (C:\dev\s1)."
    exit 1
}
Write-Info "Repo root: $(Get-Location)"

# ============================================================
# FILE 1 of 5: hero-carousel.tsx
# ============================================================
$file1Path = "src/pages-sections/fashion-2/section-1/hero-carousel.tsx"
$file1Content = @'
"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

// How long each mobile slide stays on screen before advancing (ms)
const MOBILE_SLIDE_DURATION = 5000;

const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-1.jpg`,
    headline: "Moments That Deserve to Be Noticed.",
    subheadline: "Luxury That Belongs in the Spotlight.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-2.jpg`,
    headline: "Friends. Laughter. Timeless Style.",
    subheadline: "Unforgettable moments.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-3.jpg`,
    headline: "Genuine Italian Leather. Exceptional Craftsmanship.",
    subheadline: "Exceptional service on every order, every time.",
  },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;
    setTextVisible(false);
    const t = setTimeout(() => setTextVisible(true), 300);
    video.load();
    video.play().catch(() => {});
    return () => clearTimeout(t);
  }, [current, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    setTextVisible(false);
    const fadeIn = setTimeout(() => setTextVisible(true), 300);
    const advance = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, MOBILE_SLIDE_DURATION);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(advance);
    };
  }, [current, isMobile]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  const tagline = (
    <Box sx={{
      position: "absolute",
      top: { xs: "7%", md: "10%" },
      left: 0, right: 0,
      px: { xs: 3, sm: 6, md: 8 },
      zIndex: 2,
    }}>
      <Typography sx={{
        color: "rgba(255,255,255,0.82)",
        fontWeight: 400,
        fontSize: { xs: "0.75rem", sm: "1.21rem", md: "1.32rem" },
        letterSpacing: { xs: "0.20em", md: "0.22em" },
        textTransform: "uppercase",
        textShadow: "0 1px 8px rgba(0,0,0,0.7)",
        lineHeight: 1,
      }}>
        {process.env.NEXT_PUBLIC_HERO_TAGLINE || ""}
      </Typography>
    </Box>
  );

  const textOverlay = (
    <Box sx={{
      position: "absolute",
      bottom: { xs: "9%", md: "12%" },
      left: 0, right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      px: { xs: 3, sm: 6, md: 8 },
      opacity: textVisible ? 1 : 0,
      transition: "opacity 600ms ease",
      zIndex: 2,
    }}>
      <Typography sx={{
        color: "white",
        fontWeight: 700,
        mb: { xs: 0.75, md: 1 },
        whiteSpace: "normal",
        fontSize: { xs: "1.5rem", sm: "1.95rem", md: "2.40rem" },
        textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        lineHeight: { xs: 1.15, md: 1.2 },
        maxWidth: { xs: "85vw", md: "60vw" },
      }}>
        {slide.headline}
      </Typography>
      <Typography sx={{
        color: "rgba(255,255,255,0.95)",
        fontWeight: 400,
        fontSize: { xs: "0.95rem", sm: "1.28rem", md: "1.43rem" },
        textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        lineHeight: { xs: 1.35, md: 1.4 },
        maxWidth: { xs: "85vw", md: "none" },
      }}>
        {slide.subheadline}
      </Typography>
    </Box>
  );

  const overlayStyle = {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    zIndex: 1,
  };

  if (isMobile) {
    const nextIndex = (current + 1) % SLIDES.length;
    return (
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        backgroundColor: "#111",
      }}>
        <img
          src={slide.poster}
          alt={slide.headline}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        <img
          src={SLIDES[nextIndex].poster}
          alt=""
          aria-hidden="true"
          style={{ display: "none" }}
        />
        <div style={overlayStyle} />
        {tagline}
        {textOverlay}
      </div>
    );
  }

  const desktopContainerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "90vh",
    overflow: "hidden",
    backgroundColor: "#111",
  };

  const desktopVideoStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "90vh",
    objectFit: "cover" as const,
    objectPosition: "center 20%",
  };

  return (
    <div style={desktopContainerStyle}>
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        muted
        playsInline
        autoPlay
        style={desktopVideoStyle}
      >
        <source src={slide.src} type="video/mp4" />
      </video>
      <div style={overlayStyle} />
      {tagline}
      {textOverlay}
    </div>
  );
}
'@

# ============================================================
# FILE 2 of 5: section-4 products-carousel.tsx (Best Selling)
# ============================================================
$file2Path = "src/pages-sections/fashion-2/section-4/products-carousel.tsx"
$file2Content = @'
"use client";

import type { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import { Carousel, CarouselArrows, useCarousel } from "components/slider";

export default function ProductsCarousel({ children }: PropsWithChildren) {
  const { ref, api, arrows, options } = useCarousel({
    align: "start",
    slideSpacing: "0.75rem",
    // Mobile: 2 cards visible (was 1 — cards were way too big)
    slidesToShow: { xs: 2, sm: 2, lg: 4, xl: 4 }
  });

  return (
    <Box position="relative">
      <Carousel ref={ref} api={api} options={options}>
        {children}
      </Carousel>

      <CarouselArrows
        onClickNext={arrows.onClickNext}
        onClickPrev={arrows.onClickPrev}
        disableNext={arrows.disableNext}
        disablePrev={arrows.disablePrev}
      />
    </Box>
  );
}
'@

# ============================================================
# FILE 3 of 5: section-6 products-carousel.tsx (New Arrivals)
# ============================================================
$file3Path = "src/pages-sections/fashion-2/section-6/products-carousel.tsx"
$file3Content = @'
"use client";

import type { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import { Carousel, CarouselArrows, useCarousel } from "components/slider";

export default function ProductsCarousel({ children }: PropsWithChildren) {
  const { ref, api, arrows, options } = useCarousel({
    align: "start",
    slideSpacing: "0.75rem",
    // Mobile: 2 cards visible (was 1 — cards were way too big)
    slidesToShow: { xs: 2, sm: 2, lg: 4, xl: 4 }
  });

  return (
    <Box position="relative">
      <Carousel ref={ref} api={api} options={options}>
        {children}
      </Carousel>

      <CarouselArrows
        onClickNext={arrows.onClickNext}
        onClickPrev={arrows.onClickPrev}
        disableNext={arrows.disableNext}
        disablePrev={arrows.disablePrev}
      />
    </Box>
  );
}
'@

# ============================================================
# FILE 4 of 5: product-card-8 styles.ts
# ============================================================
$file4Path = "src/components/product-cards/product-card-8/styles.ts"
$file4Content = @'
"use client";
import { styled } from "@mui/material/styles";

export const Card = styled("div")({
  width: "100%",
  overflow: "hidden",
  background: "#fff",
  border: "1px solid #e8e8e8",
  transition: "all 0.2s ease",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  ":hover": {
    borderColor: "#aaa",
    boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
    transform: "translateY(-2px)",
  },
});

export const CardHeader = styled("div")({
  padding: "14px 12px",
  borderBottom: "1px solid #f0f0f0",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 90,
  flexShrink: 0,
  "@media (max-width: 768px)": { minHeight: 56, padding: "6px 6px" },
  ".vendor": {
    fontSize: 16,
    fontWeight: 700,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
    "@media (max-width: 768px)": { fontSize: 11, letterSpacing: "0.05em", marginBottom: 2 },
  },
  ".title": {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#666",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
    textAlign: "center",
    "@media (max-width: 768px)": { fontSize: 10, lineHeight: 1.3, WebkitLineClamp: 2 },
  },
});

export const CardMedia = styled("div")({
  width: "100%",
  aspectRatio: "4 / 3",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  overflow: "hidden",
  position: "relative",
  padding: 12,
  "@media (max-width: 768px)": { padding: 6 },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "center",
  },
  ".discount-badge": {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#c41230",
    color: "white",
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.05em",
    "@media (max-width: 768px)": { top: 6, left: 6, padding: "2px 6px", fontSize: 9 },
  },
});

export const CardContent = styled("div")({
  padding: "10px 14px 12px",
  borderTop: "1px solid #f0f0f0",
  textAlign: "center",
  flexShrink: 0,
  "@media (max-width: 768px)": { padding: "6px 6px 8px" },
  ".price-block": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    "@media (max-width: 768px)": { gap: 4 },
  },
  ".retail-price": {
    fontSize: 13,
    color: "#999",
    textDecoration: "line-through",
    "@media (max-width: 768px)": { fontSize: 10 },
  },
  ".wholesale-price": {
    fontSize: 18,
    fontWeight: 800,
    color: "#111",
    "@media (max-width: 768px)": { fontSize: 13 },
  },
});
'@

# ============================================================
# FILE 5 of 5: section-3 category tiles — height only
# This one we patch surgically because the file is long and
# we only want to change the height values.
# ============================================================
$file5Path = "src/pages-sections/fashion-2/section-3/section-3-client.tsx"

# ── Collect all file operations ──────────────────────────────
$fileOps = @(
    @{ Path = $file1Path; Content = $file1Content; Label = "hero-carousel.tsx" },
    @{ Path = $file2Path; Content = $file2Content; Label = "section-4/products-carousel.tsx (Best Selling)" },
    @{ Path = $file3Path; Content = $file3Content; Label = "section-6/products-carousel.tsx (New Arrivals)" },
    @{ Path = $file4Path; Content = $file4Content; Label = "product-card-8/styles.ts" }
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# ── Pre-flight: verify every target exists ──────────────────
Write-Head "Pre-flight checks"
$allGood = $true
foreach ($op in $fileOps) {
    if (Test-Path $op.Path) {
        Write-Ok "Found: $($op.Path)"
    } else {
        Write-Fail "MISSING: $($op.Path)"
        $allGood = $false
    }
}
if (Test-Path $file5Path) {
    Write-Ok "Found: $file5Path"
} else {
    Write-Warn "MISSING: $file5Path  (will skip the category tile height fix)"
}

if (-not $allGood) {
    Write-Fail "One or more target files are missing. Aborting."
    exit 1
}

# ── Process each full-rewrite file ──────────────────────────
Write-Head "Writing files"
foreach ($op in $fileOps) {
    $backupPath = "$($op.Path).backup-$timestamp"
    if ($DryRun) {
        Write-Info "[DryRun] Would back up -> $backupPath"
        Write-Info "[DryRun] Would write    -> $($op.Path)  ($($op.Content.Length) chars)"
    } else {
        Copy-Item -Path $op.Path -Destination $backupPath -Force
        Set-Content -Path $op.Path -Value $op.Content -Encoding UTF8
        Write-Ok "Updated: $($op.Label)"
    }
}

# ── Surgical patch for section-3 category tile heights ──────
if (Test-Path $file5Path) {
    Write-Head "Patching category tile heights"
    $backupPath5 = "$file5Path.backup-$timestamp"
    if ($DryRun) {
        Write-Info "[DryRun] Would back up -> $backupPath5"
        Write-Info "[DryRun] Would replace: height: { xs: 200, sm: 280, md: 360 }"
        Write-Info "[DryRun]        with:   height: { xs: 140, sm: 220, md: 360 }"
    } else {
        Copy-Item -Path $file5Path -Destination $backupPath5 -Force
        $content5 = Get-Content $file5Path -Raw
        $old = "height: { xs: 200, sm: 280, md: 360 }"
        $new = "height: { xs: 140, sm: 220, md: 360 }"
        if ($content5.Contains($old)) {
            $content5 = $content5.Replace($old, $new)
            Set-Content -Path $file5Path -Value $content5 -Encoding UTF8 -NoNewline
            Write-Ok "Updated: category tile heights (xs 200 -> 140, sm 280 -> 220)"
        } else {
            Write-Warn "Could not find expected height line in section-3-client.tsx"
            Write-Warn "The file may have been edited. Skipping this patch."
            Write-Warn "You can manually change 'xs: 200' to 'xs: 140' in that file."
        }
    }
}

# ── Git operations ──────────────────────────────────────────
if ($Commit -or $Push) {
    Write-Head "Git"
    if ($DryRun) {
        Write-Info "[DryRun] Would run: git add <all touched files>"
        Write-Info "[DryRun] Would run: git commit -m 'Polish mobile: hero, carousels, cards, category tiles'"
    } else {
        git add $file1Path $file2Path $file3Path $file4Path $file5Path 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { Write-Fail "git add failed"; exit 1 }

        git commit -m "Polish mobile: hero, carousels, cards, category tiles"
        if ($LASTEXITCODE -ne 0) { Write-Fail "git commit failed"; exit 1 }
        Write-Ok "Committed."
    }
}

if ($Push) {
    if ($DryRun) {
        Write-Info "[DryRun] Would run: git push"
    } else {
        git push
        if ($LASTEXITCODE -ne 0) { Write-Fail "git push failed"; exit 1 }
        Write-Ok "Pushed. Vercel will start deploying."
    }
}

# ── Summary ─────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Done ===" -ForegroundColor White
Write-Host ""

if (-not $DryRun) {
    Write-Info "Backups written with suffix: .backup-$timestamp"
    Write-Info "To undo everything:"
    Write-Host "    git checkout HEAD -- src/" -ForegroundColor Gray
    Write-Host ""
}

if (-not $Commit -and -not $Push -and -not $DryRun) {
    Write-Info "Review changes with: git diff"
    Write-Info "Then commit and push manually, or re-run with -Commit -Push"
    Write-Host ""
}

Write-Info "After deploy, test on your phone. You should see:"
Write-Host "    - Hero: fixed 4:5 shape, text sized for phone, rotates every 5s" -ForegroundColor Gray
Write-Host "    - Best Selling + New Arrivals: 2 cards visible, compact layout" -ForegroundColor Gray
Write-Host "    - Product cards: smaller text and prices, browsable at 2-up" -ForegroundColor Gray
Write-Host "    - Category tiles: shorter, denser presentation" -ForegroundColor Gray
Write-Host "    - Desktop: visually unchanged" -ForegroundColor Gray
Write-Host ""
