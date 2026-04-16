# ============================================================
# fix-product-card-cropping.ps1
# ============================================================
# Fixes the "bags cropped top and bottom" issue on product cards
# in Best Selling Products and New Arrivals sections.
#
# WHAT'S WRONG NOW
#   The CardMedia container uses:
#     aspectRatio: "4 / 3"           (landscape, wider than tall)
#     img { maxWidth, maxHeight }    (object-fit doesn't work with this)
#
#   When a square 800x800 Cloudinary image is dropped into a
#   landscape container with broken object-fit, the image renders
#   at natural size and overflow:hidden clips top and bottom.
#
# WHAT THIS FIXES
#   1. Changes aspectRatio to "1 / 1" (square)
#      - Matches the Cloudinary 800x800 source perfectly
#      - Square is the e-commerce standard for product cards
#      - Handles tall bags, wide bags, clutches, totes equally well
#
#   2. Changes img sizing from maxWidth/maxHeight to width/height
#      - Now object-fit: contain actually works
#      - Image fills the box without distortion or cropping
#      - Letterboxes (white bars) only when source aspect != 1:1
#
# AFFECTS
#   - Section 4: Best Selling Products
#   - Section 6: New Arrivals
#   (Both use product-card-8)
#
# DESKTOP IMPACT
#   Cards will become square instead of landscape. This means
#   slightly taller cards on desktop too. Visually it's an
#   improvement on both desktop and mobile because the actual
#   bag fills more of the visible area.
#
# USAGE
#   .\fix-product-card-cropping.ps1 -DryRun
#   .\fix-product-card-cropping.ps1
#   .\fix-product-card-cropping.ps1 -Commit -Push
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

Write-Host ""
Write-Host "=== Fix Product Card Cropping ===" -ForegroundColor White
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Fail "No package.json found. Run from repo root (C:\dev\s1)."
    exit 1
}
Write-Info "Repo root: $(Get-Location)"

$targetPath = "src/components/product-cards/product-card-8/styles.ts"

if (-not (Test-Path $targetPath)) {
    Write-Fail "File not found: $targetPath"
    exit 1
}
Write-Ok "Found: $targetPath"

# ── New file content ────────────────────────────────────────
$newContent = @'
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

// CardMedia: square 1:1 container so square Cloudinary images
// (800x800) fit perfectly. img uses width/height (not maxW/maxH)
// so object-fit: contain actually works and prevents cropping.
export const CardMedia = styled("div")({
  width: "100%",
  aspectRatio: "1 / 1",
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
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    display: "block",
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

# ── Backup ───────────────────────────────────────────────────
$timestamp  = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "$targetPath.backup-$timestamp"

if ($DryRun) {
    Write-Info "[DryRun] Would back up to: $backupPath"
    Write-Info "[DryRun] Would rewrite: $targetPath"
    Write-Info "[DryRun] New file: $($newContent.Length) chars"
} else {
    Copy-Item -Path $targetPath -Destination $backupPath -Force
    Write-Ok "Backed up: $backupPath"
    Set-Content -Path $targetPath -Value $newContent -Encoding UTF8
    Write-Ok "Rewrote: $targetPath"
}

# ── Git ──────────────────────────────────────────────────────
if ($Commit -or $Push) {
    if ($DryRun) {
        Write-Info "[DryRun] Would commit and push"
    } else {
        Write-Host ""
        git add $targetPath 2>&1 | Out-Null
        git commit -m "Fix product card image cropping (square 1:1, proper object-fit)" 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { Write-Fail "git commit failed"; exit 1 }
        Write-Ok "Committed."

        if ($Push) {
            git push 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) { Write-Fail "git push failed"; exit 1 }
            Write-Ok "Pushed. Vercel deploying."
        }
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor White
Write-Host ""
Write-Info "After deploy, check on your phone:"
Write-Host "    - Best Selling Products: bags fully visible, no top/bottom crop" -ForegroundColor Gray
Write-Host "    - New Arrivals: same fix applies" -ForegroundColor Gray
Write-Host "    - Cards are now square instead of landscape" -ForegroundColor Gray
Write-Host ""
Write-Info "Desktop: cards are slightly taller than before (square vs landscape)."
Write-Info "This is expected and looks better."
Write-Host ""
