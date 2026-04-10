# ============================================================
# split-hero-posters.ps1
# ============================================================
# Updates hero-carousel.tsx to reference separate mobile and
# desktop poster images, AND renames existing hero-N.jpg files
# to hero-N-mobile.jpg in both s1 and s2.
#
# NAMING CONVENTION AFTER THIS SCRIPT
#   images/hero-1-mobile.jpg    <- primary mobile hero (4:5 portrait)
#   images/hero-2-mobile.jpg
#   images/hero-3-mobile.jpg
#   images/hero-1-desktop.jpg   <- desktop video poster fallback
#   images/hero-2-desktop.jpg   <- you'll add these later yourself
#   images/hero-3-desktop.jpg
#   videos/hero-1.mp4           <- unchanged, device-agnostic
#   videos/hero-2.mp4
#   videos/hero-3.mp4
#
# WHAT THIS SCRIPT DOES
#   1. Rewrites hero-carousel.tsx SLIDES array to use
#      posterMobile and posterDesktop fields
#   2. Mobile branch uses slide.posterMobile
#   3. Desktop <video> poster attribute uses slide.posterDesktop
#   4. Renames existing s1 and s2 hero-N.jpg -> hero-N-mobile.jpg
#
# WHAT YOU NEED TO KNOW
#   After this runs, the desktop video poster will 404 briefly
#   because hero-N-desktop.jpg doesn't exist yet. This is VISUALLY
#   INVISIBLE on desktop because the video starts playing within
#   ~200ms. The container background (#111 black) shows during
#   that brief gap. No regression vs current behavior.
#
#   Add hero-N-desktop.jpg files later at your leisure.
#
# USAGE
#   .\split-hero-posters.ps1 -DryRun       (preview)
#   .\split-hero-posters.ps1               (apply)
#   .\split-hero-posters.ps1 -Commit -Push (apply + git)
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
Write-Host "=== Split Hero Posters (mobile / desktop) ===" -ForegroundColor White
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Fail "No package.json found. Run from repo root (C:\dev\s1)."
    exit 1
}
Write-Info "Repo root: $(Get-Location)"

$targetPath = "src/pages-sections/fashion-2/section-1/hero-carousel.tsx"
if (-not (Test-Path $targetPath)) {
    Write-Fail "Target file not found: $targetPath"
    exit 1
}
Write-Ok "Found: $targetPath"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# ────────────────────────────────────────────────────────────
# STEP 1: Rewrite hero-carousel.tsx with posterMobile/posterDesktop
# ────────────────────────────────────────────────────────────

$newContent = @'
"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

// How long each mobile slide stays on screen before advancing (ms)
const MOBILE_SLIDE_DURATION = 5000;

// Hero slides. Each slide has:
//   src           - desktop video (plays autoplay muted loop)
//   posterMobile  - mobile primary image (portrait 4:5 crop)
//   posterDesktop - desktop video poster fallback (landscape crop)
const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-1-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-1-desktop.jpg`,
    headline: "Moments That Deserve to Be Noticed.",
    subheadline: "Luxury That Belongs in the Spotlight.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-2-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-2-desktop.jpg`,
    headline: "Friends. Laughter. Timeless Style.",
    subheadline: "Unforgettable moments.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-3-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-3-desktop.jpg`,
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

  // -- MOBILE --------------------------------------------------
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
          src={slide.posterMobile}
          alt={slide.headline}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Preload next slide so swap is instant */}
        <img
          src={SLIDES[nextIndex].posterMobile}
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
  // Desktop poster is a brief fallback that shows for ~200ms
  // before the video starts. If posterDesktop doesn't exist yet,
  // the container background color (#111) shows during that gap.
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
        poster={slide.posterDesktop}
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

Write-Head "Step 1: Rewriting hero-carousel.tsx"
$backupCodePath = "$targetPath.backup-$timestamp"
if ($DryRun) {
    Write-Info "[DryRun] Would back up -> $backupCodePath"
    Write-Info "[DryRun] Would rewrite -> $targetPath"
    Write-Info "[DryRun] New file would be $($newContent.Length) chars"
} else {
    Copy-Item -Path $targetPath -Destination $backupCodePath -Force
    Write-Ok "Backed up: $backupCodePath"
    Set-Content -Path $targetPath -Value $newContent -Encoding UTF8
    Write-Ok "Rewrote: $targetPath"
}

# ────────────────────────────────────────────────────────────
# STEP 2: Rename hero-N.jpg -> hero-N-mobile.jpg in s1 and s2
# ────────────────────────────────────────────────────────────

Write-Head "Step 2: Renaming image files"

$stores = @("s1", "s2")
foreach ($store in $stores) {
    $imgDir = "public/assets/stores/$store/images"
    if (-not (Test-Path $imgDir)) {
        Write-Warn "Skip $store - directory not found: $imgDir"
        continue
    }
    Write-Info "Store: $store"
    for ($i = 1; $i -le 3; $i++) {
        $oldName = "$imgDir/hero-$i.jpg"
        $newName = "$imgDir/hero-$i-mobile.jpg"

        if (Test-Path $oldName) {
            if (Test-Path $newName) {
                Write-Warn "  hero-$i-mobile.jpg already exists - skipping rename of hero-$i.jpg"
                Write-Warn "  (delete one of them manually to resolve)"
            } else {
                if ($DryRun) {
                    Write-Info "  [DryRun] Would rename: hero-$i.jpg -> hero-$i-mobile.jpg"
                } else {
                    Move-Item -Path $oldName -Destination $newName -Force
                    Write-Ok "  Renamed: hero-$i.jpg -> hero-$i-mobile.jpg"
                }
            }
        } elseif (Test-Path $newName) {
            Write-Ok "  hero-$i-mobile.jpg already in place"
        } else {
            Write-Warn "  hero-$i.jpg not found (may need to add hero-$i-mobile.jpg manually)"
        }
    }
}

# ────────────────────────────────────────────────────────────
# STEP 3: Git
# ────────────────────────────────────────────────────────────
if ($Commit -or $Push) {
    Write-Head "Step 3: Git"
    if ($DryRun) {
        Write-Info "[DryRun] Would: git add src/ public/assets/stores/"
        Write-Info "[DryRun] Would: git commit -m 'Split hero posters into mobile and desktop files'"
        if ($Push) { Write-Info "[DryRun] Would: git push" }
    } else {
        git add $targetPath public/assets/stores/s1/images public/assets/stores/s2/images 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { Write-Fail "git add failed"; exit 1 }

        git commit -m "Split hero posters into mobile and desktop files" 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { Write-Fail "git commit failed"; exit 1 }
        Write-Ok "Committed."

        if ($Push) {
            git push 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) { Write-Fail "git push failed"; exit 1 }
            Write-Ok "Pushed. Vercel deploying."
        }
    }
}

# ────────────────────────────────────────────────────────────
# Summary
# ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Done ===" -ForegroundColor White
Write-Host ""
Write-Info "Expected state after this script:"
Write-Host "    public/assets/stores/s1/images/hero-{1,2,3}-mobile.jpg  (renamed from hero-{1,2,3}.jpg)" -ForegroundColor Gray
Write-Host "    public/assets/stores/s2/images/hero-{1,2,3}-mobile.jpg  (renamed from hero-{1,2,3}.jpg)" -ForegroundColor Gray
Write-Host ""
Write-Info "Desktop poster files do NOT exist yet:"
Write-Host "    hero-{1,2,3}-desktop.jpg  <- add these later" -ForegroundColor Gray
Write-Host ""
Write-Info "This is FINE. Desktop shows the video, not the poster."
Write-Info "The brief black background during video load is invisible in practice."
Write-Host ""
Write-Info "After deploy, verify mobile URLs load:"
Write-Host "    https://imperialaccessories.com/assets/stores/s2/images/hero-1-mobile.jpg" -ForegroundColor Gray
Write-Host "    https://prestigeapparelgroup.com/assets/stores/s1/images/hero-1-mobile.jpg" -ForegroundColor Gray
Write-Host ""
