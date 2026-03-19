# apply-mobile-category-fix.ps1
# Run this from the ROOT of your Next.js project directory.
# Usage: .\apply-mobile-category-fix.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Mobile Categories Fix — File Installer  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ── Resolve project root (the folder this script lives in) ──────────────────
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Project root: $projectRoot" -ForegroundColor Gray
Write-Host ""

# ── File map: source (relative to script) → destination (relative to project) ─
$files = @(
    @{
        Source      = "layout.ts"
        Destination = "src\utils\__api__\layout.ts"
        Description = "Shopify layout API — adds productsCount to GraphQL query"
    },
    @{
        Source      = "page-view.tsx"
        Destination = "src\app\mobile-categories\page-view.tsx"
        Description = "Mobile categories page — renders category list with product counts"
    }
)

# ── Process each file ────────────────────────────────────────────────────────
foreach ($file in $files) {
    $src  = Join-Path $projectRoot $file.Source
    $dest = Join-Path $projectRoot $file.Destination

    Write-Host "File : $($file.Description)" -ForegroundColor White
    Write-Host "  From : $src"
    Write-Host "  To   : $dest"

    # Verify source exists
    if (-not (Test-Path $src)) {
        Write-Host "  ERROR: Source file not found — $src" -ForegroundColor Red
        Write-Host "  Make sure layout.ts and page-view.tsx are in the same folder as this script." -ForegroundColor Yellow
        exit 1
    }

    # Backup existing file if present
    if (Test-Path $dest) {
        $backup = "$dest.bak"
        Copy-Item -Path $dest -Destination $backup -Force
        Write-Host "  Backed up existing file to: $backup" -ForegroundColor DarkYellow
    }

    # Ensure destination directory exists
    $destDir = Split-Path -Parent $dest
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        Write-Host "  Created directory: $destDir" -ForegroundColor DarkGray
    }

    # Copy the file
    Copy-Item -Path $src -Destination $dest -Force
    Write-Host "  OK" -ForegroundColor Green
    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  All files installed successfully!        " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart your dev server:  npm run dev" -ForegroundColor Gray
Write-Host "  2. Open /mobile-categories in your browser or iPhone" -ForegroundColor Gray
Write-Host "  3. Each category should now show its product count on the right" -ForegroundColor Gray
Write-Host ""
Write-Host "To roll back, rename the .bak files back to their original names." -ForegroundColor DarkYellow
Write-Host ""
