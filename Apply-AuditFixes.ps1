#Requires -Version 5.1
<#
.SYNOPSIS
    Applies all fixes identified in the Next.js template audit report.

.DESCRIPTION
    Run this script from ANY folder — it will search upward and sideways for
    the src/ directory automatically. It looks for package.json + src/ together
    so it finds the correct project root even if nested inside a parent folder.

.EXAMPLE
    cd C:\dev\s1
    .\Apply-AuditFixes.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Colour helpers ────────────────────────────────────────────────────────────
function Write-Pass { param($msg) Write-Host "  [PASS] $msg" -ForegroundColor Green  }
function Write-Fail { param($msg) Write-Host "  [FAIL] $msg" -ForegroundColor Red    }
function Write-Skip { param($msg) Write-Host "  [SKIP] $msg" -ForegroundColor Yellow }
function Write-Head { param($msg) Write-Host "`n=== $msg ===" -ForegroundColor Cyan  }
function Write-Info { param($msg) Write-Host "        $msg"  -ForegroundColor Gray   }

# ── Log file ──────────────────────────────────────────────────────────────────
$LogFile   = ".\audit-fix-log.txt"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"Audit fix run: $Timestamp" | Out-File $LogFile -Encoding utf8

$PassCount = 0
$FailCount = 0
$SkipCount = 0

# ── Read / write helpers (UTF-8 no BOM) ──────────────────────────────────────
function Get-FileText {
    param([string]$Path)
    if (-not (Test-Path $Path)) { throw "File not found: $Path" }
    return [System.IO.File]::ReadAllText($Path, [System.Text.UTF8Encoding]::new($false))
}

function Set-FileText {
    param([string]$Path, [string]$Content)
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

# ── Auto-detect project root ──────────────────────────────────────────────────
Write-Head "Locating project root"

# Walk from current directory downward looking for package.json + src/ together
$Root = $null

# First check the current directory and its immediate children
$SearchBases = @( (Get-Location).Path )
Get-ChildItem -Path (Get-Location).Path -Directory | ForEach-Object {
    $SearchBases += $_.FullName
}

foreach ($base in $SearchBases) {
    if ((Test-Path (Join-Path $base 'package.json')) -and (Test-Path (Join-Path $base 'src'))) {
        $Root = $base
        break
    }
}

if (-not $Root) {
    Write-Host ""
    Write-Host "ERROR: Could not find a folder containing both package.json and src/." -ForegroundColor Red
    Write-Host "       Searched: $(Get-Location) and its immediate subfolders." -ForegroundColor Red
    Write-Host "       Please cd into your project folder (the one with package.json) and try again." -ForegroundColor Red
    exit 1
}

Write-Pass "Project root found: $Root"
Write-Info  "src/ is at: $Root\src"
"Project root: $Root" | Add-Content $LogFile

# Helper to build a full path from the detected root
function RootPath {
    param([string]$RelPath)
    return Join-Path $Root $RelPath
}

# ── Core fix function ─────────────────────────────────────────────────────────
function Apply-Fix {
    param(
        [string]$StepName,
        [string]$FilePath,
        [string]$OldText,
        [string]$NewText,
        [string]$AlreadyFixed = ""
    )

    Write-Head $StepName

    if (-not (Test-Path $FilePath)) {
        Write-Fail "File not found: $FilePath"
        "FAIL [$StepName] File not found: $FilePath" | Add-Content $LogFile
        $script:FailCount++
        return
    }

    $content = Get-FileText $FilePath

    if ($AlreadyFixed -ne "" -and $content.Contains($AlreadyFixed)) {
        Write-Skip "Already applied - skipping"
        "SKIP [$StepName] Already applied" | Add-Content $LogFile
        $script:SkipCount++
        return
    }

    if (-not $content.Contains($OldText)) {
        Write-Fail "Search string not found - file may have changed or fix already applied."
        Write-Info  "File: $FilePath"
        "FAIL [$StepName] Search string not found in $FilePath" | Add-Content $LogFile
        $script:FailCount++
        return
    }

    $updated = $content.Replace($OldText, $NewText)
    Set-FileText $FilePath $updated
    Write-Pass "Updated: $FilePath"
    "PASS [$StepName] $FilePath" | Add-Content $LogFile
    $script:PassCount++
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 - Fix product page double data unwrap
# ─────────────────────────────────────────────────────────────────────────────

$step1Old   = '  const raw = data?.data?.product;'
$step1New   = '  const raw = data?.product;'
$step1Check = 'const raw = data?.product;'
$step1File  = RootPath 'src\app\product\[slug]\page.tsx'

Apply-Fix `
    -StepName     'Step 1 - Fix product page double data unwrap' `
    -FilePath     $step1File `
    -OldText      $step1Old `
    -NewText      $step1New `
    -AlreadyFixed $step1Check

Write-Info 'Fixes the critical 404 bug - every product page was returning notFound().'

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 - Fix collection to product route mismatch
# ─────────────────────────────────────────────────────────────────────────────

$step2Old   = 'href={`/products/${product.slug}`}'
$step2New   = 'href={`/product/${product.slug}`}'
$step2Check = 'href={`/product/${product.slug}`}'
$step2File  = RootPath 'src\app\collections\[slug]\page.tsx'

Apply-Fix `
    -StepName     'Step 2 - Fix collection product link route' `
    -FilePath     $step2File `
    -OldText      $step2Old `
    -NewText      $step2New `
    -AlreadyFixed $step2Check

Write-Info 'Collection grid now links to /product/[slug] matching the new route.'

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3a - Expose checkoutUrl from useCart in checkout page
# ─────────────────────────────────────────────────────────────────────────────

$step3aOld   = '  const { state } = useCart() as any;'
$step3aNew   = '  const { state, checkoutUrl } = useCart() as any;'
$step3aCheck = 'checkoutUrl } = useCart()'
$step3aFile  = RootPath 'src\pages-sections\checkout\page-view\checkout.tsx'

Apply-Fix `
    -StepName     'Step 3a - Expose checkoutUrl from useCart in checkout page' `
    -FilePath     $step3aFile `
    -OldText      $step3aOld `
    -NewText      $step3aNew `
    -AlreadyFixed $step3aCheck

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3b - Add onClick to Proceed To Payment button
# ─────────────────────────────────────────────────────────────────────────────

$step3bOld = @'
            <Button
              variant="contained"
              sx={{
                height: 56,
                px: 6,
                fontSize: 16
              }}
            >
              Proceed To Payment
            </Button>
'@

$step3bNew = @'
            <Button
              variant="contained"
              sx={{
                height: 56,
                px: 6,
                fontSize: 16
              }}
              onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}
            >
              Proceed To Payment
            </Button>
'@

$step3bCheck = 'window.location.href = checkoutUrl'
$step3bFile  = RootPath 'src\pages-sections\checkout\page-view\checkout.tsx'

Apply-Fix `
    -StepName     'Step 3b - Add onClick handler to Proceed To Payment button' `
    -FilePath     $step3bFile `
    -OldText      $step3bOld `
    -NewText      $step3bNew `
    -AlreadyFixed $step3bCheck

Write-Info 'Remember Step 3c (manual): expose checkoutUrl from CartContext - see reminder at end.'

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4 - Fix mini-cart drawer width mismatch (420 to 520)
# ─────────────────────────────────────────────────────────────────────────────

$step4Old   = '          sx: { width: 420 }'
$step4New   = '          sx: { width: 520 }'
$step4Check = 'sx: { width: 520 }'
$step4File  = RootPath 'src\app\@modal\(.)mini-cart\page.tsx'

Apply-Fix `
    -StepName     'Step 4 - Fix mini-cart drawer width 420 to 520' `
    -FilePath     $step4File `
    -OldText      $step4Old `
    -NewText      $step4New `
    -AlreadyFixed $step4Check

Write-Info 'Drawer paper width now matches the MiniCart component internal width.'

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5 - Fix Section 6 duplicate product data source
# ─────────────────────────────────────────────────────────────────────────────

$step5Old   = '  const products = await api.getProducts();'
$step5New   = '  const products = await api.getFeatureProducts();'
$step5Check = 'api.getFeatureProducts()'
$step5File  = RootPath 'src\pages-sections\fashion-2\section-6\section-6.tsx'

Apply-Fix `
    -StepName     'Step 5 - Fix Section 6 data source getProducts to getFeatureProducts' `
    -FilePath     $step5File `
    -OldText      $step5Old `
    -NewText      $step5New `
    -AlreadyFixed $step5Check

Write-Info 'New Arrivals section now fetches featured products instead of best sellers.'

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6 - Check cartList is exposed from CartContext
# ─────────────────────────────────────────────────────────────────────────────
Write-Head 'Step 6 - Check cartList in CartContext'

$cartFile = RootPath 'src\pages-sections\cart\page-view\cart.tsx'
if (Test-Path $cartFile) {
    $cartContent = Get-FileText $cartFile
    if ($cartContent.Contains('cartList') -and $cartContent.Contains('useCart')) {

        $contextCandidates = @(
            (RootPath 'src\contexts\CartContext.tsx'),
            (RootPath 'src\contexts\cart-context.tsx'),
            (RootPath 'src\context\CartContext.tsx'),
            (RootPath 'src\contexts\CartContext.ts')
        )
        $contextFile = $contextCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

        if ($contextFile) {
            $ctxContent = Get-FileText $contextFile
            if ($ctxContent.Contains('cartList')) {
                Write-Pass "CartContext already exposes cartList - no change needed."
                "PASS [Step 6] CartContext already exposes cartList" | Add-Content $LogFile
                $script:PassCount++
            } else {
                Write-Fail "CartContext does NOT expose cartList."
                Write-Info  "MANUAL FIX REQUIRED:"
                Write-Info  "  Open: $contextFile"
                Write-Info  "  Find the value object in the context provider and add:"
                Write-Info  "    cartList: state.cart,"
                "FAIL [Step 6] CartContext missing cartList - manual fix needed in $contextFile" | Add-Content $LogFile
                $script:FailCount++
            }
        } else {
            Write-Skip "CartContext file not found at expected paths - check manually."
            Write-Info  "Search $Root\src for CartContext and ensure it exposes cartList."
            "SKIP [Step 6] CartContext not found at expected paths" | Add-Content $LogFile
            $script:SkipCount++
        }
    } else {
        Write-Skip "cart.tsx does not use cartList - no action needed."
        "SKIP [Step 6] cart.tsx does not use cartList" | Add-Content $LogFile
        $script:SkipCount++
    }
} else {
    Write-Fail "Cart page not found: $cartFile"
    "FAIL [Step 6] $cartFile not found" | Add-Content $LogFile
    $script:FailCount++
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 7 - Verify static assets
# ─────────────────────────────────────────────────────────────────────────────
Write-Head 'Step 7 - Verify required static assets'

$assets = @(
    (RootPath 'public\assets\stores\s1\logo\logo-transparent.png'),
    (RootPath 'public\assets\stores\s1\videos\hero-3.mp4')
)

foreach ($asset in $assets) {
    if (Test-Path $asset) {
        Write-Pass "Found: $asset"
        "PASS [Step 7] Asset exists: $asset" | Add-Content $LogFile
        $script:PassCount++
    } else {
        Write-Fail "MISSING: $asset"
        Write-Info  "Add this file to your public folder, OR remove the reference from:"
        Write-Info  "  $Root\src\pages-sections\fashion-2\section-1\hero-carousel.tsx"
        "FAIL [Step 7] Missing asset: $asset" | Add-Content $LogFile
        $script:FailCount++
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " RESULTS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Passed : $PassCount" -ForegroundColor Green
Write-Host "  Skipped: $SkipCount" -ForegroundColor Yellow
if ($FailCount -gt 0) {
    Write-Host "  Failed : $FailCount" -ForegroundColor Red
} else {
    Write-Host "  Failed : $FailCount" -ForegroundColor Green
}
Write-Host "  Log    : $LogFile"
Write-Host "================================================" -ForegroundColor Cyan

# ─────────────────────────────────────────────────────────────────────────────
# MANUAL STEPS REMINDER
# ─────────────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "MANUAL STEPS STILL REQUIRED:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Step 3c - Expose checkoutUrl from CartContext" -ForegroundColor Yellow
Write-Host "    Open your CartContext file (src/contexts/CartContext.tsx or similar)." -ForegroundColor Gray
Write-Host "    The cart state already stores checkoutUrl from shopifyCreateCart()." -ForegroundColor Gray
Write-Host "    Make sure the context value object includes:" -ForegroundColor Gray
Write-Host "      checkoutUrl: state.checkoutUrl" -ForegroundColor Gray
Write-Host "    Without this the Proceed To Payment button will silently do nothing." -ForegroundColor Gray
Write-Host ""
Write-Host "  Step 8 - Variant Selector (REQUIRED BEFORE GO-LIVE)" -ForegroundColor Yellow
Write-Host "    Multi-variant products will always add the first variant silently." -ForegroundColor Gray
Write-Host "    Open: $Root\src\pages-sections\product-details\product-intro\product-intro.tsx" -ForegroundColor Gray
Write-Host "    Re-add ProductVariantSelector above the AddToCart component." -ForegroundColor Gray
Write-Host "    Wire selected variant ID through to the addToCart call." -ForegroundColor Gray
Write-Host ""

"" | Add-Content $LogFile
"Manual steps: Step 3c (CartContext checkoutUrl), Step 8 (variant selector)" | Add-Content $LogFile
"Run completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Add-Content $LogFile

if ($FailCount -gt 0) {
    Write-Host "Some steps failed - review the output above and audit-fix-log.txt." -ForegroundColor Red
    exit 1
} else {
    Write-Host "All automated fixes applied. Complete the manual steps, then run:" -ForegroundColor Green
    Write-Host "  npm run dev" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}
