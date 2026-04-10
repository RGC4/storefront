# ============================================================
# install-hero-carousel.ps1
# ============================================================
# Drops a corrected hero-carousel.tsx into place, backs up the
# old one, optionally commits and pushes to Git.
#
# WHAT THIS FIXES
#   - Mobile: image was sized with 90vh, causing it to grow as
#     iOS Safari's address bar collapsed on scroll. Now uses a
#     fixed 4:5 aspect-ratio container. No more jumping.
#   - Mobile: carousel was stuck on slide 1 forever because the
#     video's onEnded handler never fired (no video on mobile).
#     Now mobile auto-rotates on a timer.
#   - Mobile: next slide is preloaded for instant swap.
#   - Desktop: unchanged. Still plays the MP4s.
#
# USAGE
#   Run from your repo root:
#     .\install-hero-carousel.ps1
#
#   Or with auto-commit and push:
#     .\install-hero-carousel.ps1 -Commit -Push
#
#   To preview without writing anything:
#     .\install-hero-carousel.ps1 -DryRun
# ============================================================

[CmdletBinding()]
param(
    [switch]$Commit,
    [switch]$Push,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Info  ($msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Write-Ok    ($msg) { Write-Host "+ $msg" -ForegroundColor Green }
function Write-Warn  ($msg) { Write-Host "! $msg" -ForegroundColor Yellow }
function Write-Fail  ($msg) { Write-Host "X $msg" -ForegroundColor Red }

# ── Sanity checks ─────────────────────────────────────────────
Write-Host ""
Write-Host "=== Hero Carousel Installer ===" -ForegroundColor White
Write-Host ""

$repoRoot = Get-Location
Write-Info "Repo root: $repoRoot"

if (-not (Test-Path "package.json")) {
    Write-Fail "No package.json found. Run this from your repo root."
    exit 1
}

$targetPath = "src/pages-sections/fashion-2/section-1/hero-carousel.tsx"
$targetDir  = Split-Path $targetPath

if (-not (Test-Path $targetDir)) {
    Write-Fail "Target directory not found: $targetDir"
    Write-Fail "Are you in the right repo?"
    exit 1
}

if (-not (Test-Path $targetPath)) {
    Write-Warn "Existing hero-carousel.tsx not found at: $targetPath"
    Write-Warn "Will create a new file."
} else {
    Write-Ok "Found existing file: $targetPath"
}

# ── Source content ────────────────────────────────────────────
$sourceContent = @'
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

  // Desktop: video drives the carousel via onEnded
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

  // Mobile: timer drives the carousel since there is no video
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
      top: { xs: "8%", md: "10%" },
      left: 0,
      right: 0,
      px: { xs: 3, sm: 6, md: 8 },
      zIndex: 2,
    }}>
      <Typography sx={{
        color: "rgba(255,255,255,0.82)",
        fontWeight: 400,
        fontSize: { xs: "1.16rem", sm: "1.21rem", md: "1.32rem" },
        letterSpacing: { xs: "0.18em", md: "0.22em" },
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
      bottom: { xs: "10%", md: "12%" },
      left: 0,
      right: 0,
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
        mb: 1,
        whiteSpace: "normal",
        fontSize: { xs: "1.65rem", sm: "1.95rem", md: "2.40rem" },
        textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        lineHeight: 1.2,
        maxWidth: { xs: "90vw", md: "60vw" },
      }}>
        {slide.headline}
      </Typography>
      <Typography sx={{
        color: "rgba(255,255,255,0.95)",
        fontWeight: 400,
        fontSize: { xs: "1.20rem", sm: "1.28rem", md: "1.43rem" },
        textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        maxWidth: { xs: "90vw", md: "none" },
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

  // -- MOBILE --------------------------------------------------
  // Fixed 4:5 portrait container. No vh units (avoids iOS Safari
  // address-bar resize jump). Static image, auto-rotates every
  // MOBILE_SLIDE_DURATION ms. Preloads next image for smooth swap.
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
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Preload the next slide so swap is instant */}
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

  // -- DESKTOP -------------------------------------------------
  // Full-bleed 90vh video, autoplay muted loop. Unchanged behavior.
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

# ── Backup existing file ──────────────────────────────────────
if (Test-Path $targetPath) {
    $timestamp  = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupPath = "$targetPath.backup-$timestamp"
    if ($DryRun) {
        Write-Info "[DryRun] Would back up existing file to: $backupPath"
    } else {
        Copy-Item -Path $targetPath -Destination $backupPath -Force
        Write-Ok "Backed up existing file to: $backupPath"
    }
}

# ── Write new file ────────────────────────────────────────────
if ($DryRun) {
    Write-Info "[DryRun] Would write new file to: $targetPath"
    Write-Info "[DryRun] File size: $($sourceContent.Length) chars"
} else {
    Set-Content -Path $targetPath -Value $sourceContent -Encoding UTF8
    Write-Ok "Wrote new file: $targetPath"
}

# ── Git commit ────────────────────────────────────────────────
if ($Commit -or $Push) {
    if ($DryRun) {
        Write-Info "[DryRun] Would run: git add $targetPath"
        Write-Info "[DryRun] Would run: git commit -m 'Fix mobile hero carousel: aspect ratio and auto-rotate'"
    } else {
        Write-Host ""
        Write-Info "Staging file..."
        git add $targetPath
        if ($LASTEXITCODE -ne 0) { Write-Fail "git add failed"; exit 1 }

        Write-Info "Committing..."
        git commit -m "Fix mobile hero carousel: aspect ratio and auto-rotate"
        if ($LASTEXITCODE -ne 0) { Write-Fail "git commit failed"; exit 1 }

        Write-Ok "Committed."
    }
}

# ── Git push ──────────────────────────────────────────────────
if ($Push) {
    if ($DryRun) {
        Write-Info "[DryRun] Would run: git push"
    } else {
        Write-Host ""
        Write-Info "Pushing to origin..."
        git push
        if ($LASTEXITCODE -ne 0) { Write-Fail "git push failed"; exit 1 }
        Write-Ok "Pushed. Vercel should start deploying within seconds."
    }
}

# ── Done ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Done ===" -ForegroundColor White
Write-Host ""
if (-not $Commit -and -not $Push) {
    Write-Info "File written but not committed. To commit and push:"
    Write-Host "    git add $targetPath" -ForegroundColor Gray
    Write-Host "    git commit -m 'Fix mobile hero carousel: aspect ratio and auto-rotate'" -ForegroundColor Gray
    Write-Host "    git push" -ForegroundColor Gray
    Write-Host ""
}
Write-Info "After deploy, test on your phone:"
Write-Host "    https://www.prestigeapparelgroup.com" -ForegroundColor Gray
Write-Host "    https://www.imperialaccessories.com" -ForegroundColor Gray
Write-Host ""
Write-Info "You should see:"
Write-Host "    - A fixed-shape hero (no growing/shrinking on scroll)" -ForegroundColor Gray
Write-Host "    - Auto-rotation through all 3 poster images every 5 seconds" -ForegroundColor Gray
Write-Host "    - Desktop unchanged" -ForegroundColor Gray
Write-Host ""
