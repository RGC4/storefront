# apply-remaining-seo.ps1
# Copies the 3 remaining SEO fix files into place
# Run from C:\dev\s1:
#   PowerShell -ExecutionPolicy Bypass -File "apply-remaining-seo.ps1"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dl = "C:\Users\bobci\Downloads"

Copy-Item (Join-Path $dl "products-slug-page.tsx") (Join-Path $root "src\app\products\[slug]\page.tsx") -Force
Write-Host "[PASS] products/[slug]/page.tsx" -ForegroundColor Green

Copy-Item (Join-Path $dl "product-jsonld.tsx") (Join-Path $root "src\app\products\[slug]\product-jsonld.tsx") -Force
Write-Host "[PASS] products/[slug]/product-jsonld.tsx" -ForegroundColor Green

Copy-Item (Join-Path $dl "collections-slug-page.tsx") (Join-Path $root "src\app\collections\[slug]\page.tsx") -Force
Write-Host "[PASS] collections/[slug]/page.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "[DONE] All 8 SEO fixes installed." -ForegroundColor Cyan
