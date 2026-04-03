# =============================================================
# apply-seo-fixes.ps1
# Distributes SEO fix files to correct project locations
#
# Run from project root:
#   PowerShell -ExecutionPolicy Bypass -File "apply-seo-fixes.ps1" -SourceDir "C:\Users\bobci\Downloads\prestige-seo-fixes"
# =============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$SourceDir
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Fail  { param($msg) Write-Host "[FAIL]  $msg" -ForegroundColor Red }
function Warn  { param($msg) Write-Host "[WARN]  $msg" -ForegroundColor Yellow }

Info "=========================================="
Info "  SEO Fixes Installer"
Info "=========================================="
Info "Project root : $root"
Info "Source dir   : $SourceDir"
Info ""

if (-not (Test-Path $SourceDir)) {
    Fail "Source directory not found: $SourceDir"
    exit 1
}

$packageJson = Join-Path $root "package.json"
if (-not (Test-Path $packageJson)) {
    Fail "No package.json found in $root - run from project root."
    exit 1
}

$files = @(
    @{ src = "src\app\sitemap.ts";                          desc = "Dynamic sitemap" },
    @{ src = "src\app\layout.tsx";                           desc = "Root layout with JSON-LD" },
    @{ src = "src\app\page.tsx";                             desc = "Homepage metadata" },
    @{ src = "src\app\robots.ts";                            desc = "Robots.txt" },
    @{ src = "src\app\not-found.tsx";                        desc = "404 page" },
    @{ src = "src\app\products\[slug]\page.tsx";             desc = "Product page metadata" },
    @{ src = "src\app\products\[slug]\product-jsonld.tsx";   desc = "Product JSON-LD schema" },
    @{ src = "src\app\collections\[slug]\page.tsx";          desc = "Collection page metadata" }
)

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    $srcPath  = Join-Path $SourceDir $file.src
    $destPath = Join-Path $root $file.src
    $destDir  = Split-Path -Parent $destPath

    Info "Processing: $($file.src)"
    Info "  $($file.desc)"

    if (-not (Test-Path $srcPath)) {
        Fail "  Source not found: $srcPath"
        $failCount++
        continue
    }

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        Info "  Created directory: $destDir"
    }

    if (Test-Path $destPath) {
        $backupPath = "$destPath.bak"
        Copy-Item -Path $destPath -Destination $backupPath -Force
        Warn "  Backed up existing file"
    }

    Copy-Item -Path $srcPath -Destination $destPath -Force
    Pass "  Installed"
    $successCount++
    Write-Host ""
}

Write-Host ""
Info "=========================================="
if ($failCount -eq 0) {
    Pass "All $successCount files installed successfully!"
} else {
    Warn "$successCount succeeded, $failCount failed"
}
Info "=========================================="
Write-Host ""
Info "NEXT STEPS:"
Info ""
Info "1. Add env var to Vercel: NEXT_PUBLIC_SITE_URL=https://yourdomain.com"
Info ""
Info "2. Push to deploy:"
Info "   git add -A"
Info "   git commit -m SEO-fixes"
Info "   git push"
Info ""
Info "3. Verify: visit https://yourdomain.com/sitemap.xml"
Info "4. Submit sitemap in Google Search Console"
Info "5. Test rich results: https://search.google.com/test/rich-results"
