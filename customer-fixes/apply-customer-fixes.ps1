# ============================================================
# Prestige Apparel Group - Customer Experience Fixes
# Run from your project root: C:\dev\s1
#
#   powershell -ExecutionPolicy Bypass -File "C:\dev\s1\customer-fixes\apply-customer-fixes.ps1"
# ============================================================

$ProjectDir = "C:\dev\s1"
$FixesDir   = "C:\dev\s1\customer-fixes"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Applying Customer Experience Fixes       " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$files = @(
    @{ src = "src\config\store.config.ts";                                      dst = "src\config\store.config.ts" },
    @{ src = "src\utils\__api__\layout.ts";                                     dst = "src\utils\__api__\layout.ts" },
    @{ src = "src\components\footer\footer-contact.tsx";                        dst = "src\components\footer\footer-contact.tsx" },
    @{ src = "src\pages-sections\payment\payment-summery.tsx";                  dst = "src\pages-sections\payment\payment-summery.tsx" },
    @{ src = "src\pages-sections\payment\credit-card-form.tsx";                 dst = "src\pages-sections\payment\credit-card-form.tsx" },
    @{ src = "src\pages-sections\payment\payment-form.tsx";                     dst = "src\pages-sections\payment\payment-form.tsx" },
    @{ src = "src\pages-sections\order-confirmation\page-view.tsx";             dst = "src\pages-sections\order-confirmation\page-view.tsx" },
    @{ src = "src\pages-sections\cart\checkout-form.tsx";                       dst = "src\pages-sections\cart\checkout-form.tsx" },
    @{ src = "src\pages-sections\sessions\page-view\login.tsx";                 dst = "src\pages-sections\sessions\page-view\login.tsx" },
    @{ src = "src\pages-sections\sessions\page-view\register.tsx";              dst = "src\pages-sections\sessions\page-view\register.tsx" }
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
Write-Host "  Done: $success updated, $failed skipped  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "FILES CHANGED:" -ForegroundColor Yellow
Write-Host "  store.config.ts     - phone, email, address set" -ForegroundColor White
Write-Host "  layout.ts           - footer links, support ticket, contact links" -ForegroundColor White
Write-Host "  footer-contact.tsx  - email and phone are now clickable links" -ForegroundColor White
Write-Host "  payment-summery.tsx - pulls real cart totals (no more hardcoded numbers)" -ForegroundColor White
Write-Host "  credit-card-form.tsx- fixed duplicate Name field, added CVV, lock message" -ForegroundColor White
Write-Host "  payment-form.tsx    - removed Cash on Delivery, clean button labels" -ForegroundColor White
Write-Host "  page-view.tsx       - order confirmation: correct links, support + email" -ForegroundColor White
Write-Host "  checkout-form.tsx   - real totals, free shipping notice, cleaner layout" -ForegroundColor White
Write-Host "  login.tsx           - clean labels, forgot password link" -ForegroundColor White
Write-Host "  register.tsx        - clean labels, T&C + Privacy links" -ForegroundColor White
Write-Host ""
Write-Host "REMINDER: Update store.config.ts with your real phone/email/address" -ForegroundColor Yellow
Write-Host "  or set these in your .env file:" -ForegroundColor White
Write-Host "  NEXT_PUBLIC_STORE_PHONE=+1 (800) 123-4567" -ForegroundColor Gray
Write-Host "  NEXT_PUBLIC_STORE_EMAIL=info@prestigeapparelgroup.com" -ForegroundColor Gray
Write-Host "  NEXT_PUBLIC_STORE_ADDRESS=123 Fashion Ave, Toronto, ON" -ForegroundColor Gray
Write-Host ""
Write-Host "Run: npm run dev" -ForegroundColor Green
Write-Host ""
