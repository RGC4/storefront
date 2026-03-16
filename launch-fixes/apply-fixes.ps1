# ============================================================
# Prestige Apparel Group - Pre-Launch Fix Deploy Script
# Run this from the ROOT of your project folder:
#   cd C:\path\to\your\project
#   .\launch-fixes\apply-fixes.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$FixesDir = "C:\dev\s1\launch-fixes"
$ProjectDir = "C:\dev\s1"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Prestige Apparel Group - Applying Fixes  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$files = @(
    @{ src = "src\pages-sections\sessions\layout.tsx";               dst = "src\pages-sections\sessions\layout.tsx" },
    @{ src = "src\pages-sections\order-confirmation\page-view.tsx";  dst = "src\pages-sections\order-confirmation\page-view.tsx" },
    @{ src = "src\pages-sections\fashion-2\page-view\fashion-2.tsx"; dst = "src\pages-sections\fashion-2\page-view\fashion-2.tsx" },
    @{ src = "src\app\layout.tsx";                                    dst = "src\app\layout.tsx" },
    @{ src = "src\app\(checkout)\cart\page.tsx";                     dst = "src\app\(checkout)\cart\page.tsx" },
    @{ src = "src\app\(checkout)\checkout\page.tsx";                 dst = "src\app\(checkout)\checkout\page.tsx" },
    @{ src = "src\app\(checkout)\payment\page.tsx";                  dst = "src\app\(checkout)\payment\page.tsx" },
    @{ src = "src\app\login\page.tsx";                               dst = "src\app\login\page.tsx" },
    @{ src = "src\app\register\page.tsx";                            dst = "src\app\register\page.tsx" },
    @{ src = "src\app\order-confirmation\page.tsx";                  dst = "src\app\order-confirmation\page.tsx" },
    @{ src = "src\app\fashion-2\page.tsx";                           dst = "src\app\fashion-2\page.tsx" }
)

$success = 0
$failed  = 0

foreach ($file in $files) {
    $srcPath = Join-Path $FixesDir $file.src
    $dstPath = Join-Path $ProjectDir $file.dst

    if (-not (Test-Path $srcPath)) {
        Write-Host "  SKIP (not found): $($file.src)" -ForegroundColor Yellow
        $failed++
        continue
    }

    if (Test-Path $dstPath) {
        Copy-Item $dstPath "$dstPath.bak" -Force
    }

    $dstDir = Split-Path $dstPath -Parent
    if (-not (Test-Path $dstDir)) {
        New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
    }

    Copy-Item $srcPath $dstPath -Force
    Write-Host "  OK  $($file.dst)" -ForegroundColor Green
    $success++
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Done: $success files updated, $failed skipped" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Add NEXT_PUBLIC_GA_ID=G-XKPD36JXY0 to your .env file" -ForegroundColor White
Write-Host "  2. Run: npm run dev to test locally" -ForegroundColor White
Write-Host ""
