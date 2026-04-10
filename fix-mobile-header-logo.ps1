# ============================================================
# fix-mobile-header-logo.ps1
# ============================================================
# Surgical one-line fix for the mobile header logo bug.
#
# THE BUG
#   src/components/header/mobile-header/mobile-header.tsx
#   defines MobileHeader.Logo as a function that receives a
#   logoUrl prop, but then completely ignores the prop and
#   hardcodes:
#     src="/assets/stores/s1/logo/logo-header-mobile.png"
#
#   Every parent component correctly passes logoUrl with the
#   right per-store value (e.g. logoUrl={mobileNavigation.logo}),
#   but the child throws it away. Result: every store's mobile
#   header shows the s1 (Prestige) logo regardless of which
#   store you're on.
#
# THE FIX
#   Change one line:
#     src="/assets/stores/s1/logo/logo-header-mobile.png"
#   to:
#     src={logoUrl}
#
#   Now the component honors the prop the parent is passing.
#   Same model as the desktop header (which already works).
#   Zero hardcoded paths anywhere.
#
# WHAT THIS DOES NOT TOUCH
#   - storeSchema.ts (defaults / fallbacks)
#   - store.config.ts (defaults / fallbacks)
#   - Any logo files
#   - Anything else
#
#   The defaults in those other files are unused in production
#   because parent components override them with real per-store
#   values. Leave them alone.
#
# USAGE
#   .\fix-mobile-header-logo.ps1 -DryRun
#   .\fix-mobile-header-logo.ps1
#   .\fix-mobile-header-logo.ps1 -Commit -Push
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
Write-Host "=== Fix Mobile Header Logo (hardcoded s1) ===" -ForegroundColor White
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Fail "No package.json found. Run from repo root (C:\dev\s1)."
    exit 1
}

$targetPath = "src/components/header/mobile-header/mobile-header.tsx"
if (-not (Test-Path $targetPath)) {
    Write-Fail "File not found: $targetPath"
    exit 1
}
Write-Ok "Found: $targetPath"

# ── Load and search ─────────────────────────────────────────
$content = Get-Content $targetPath -Raw

$old = 'src="/assets/stores/s1/logo/logo-header-mobile.png"'
$new = 'src={logoUrl}'

if (-not $content.Contains($old)) {
    Write-Warn "Expected hardcoded line not found."
    Write-Warn "Looking for: $old"
    Write-Warn ""
    Write-Warn "The file may already be fixed. Verify with:"
    Write-Warn "  Select-String -Path '$targetPath' -Pattern 'src='"
    exit 0
}

Write-Ok "Found expected hardcoded line"

# ── Backup ──────────────────────────────────────────────────
$timestamp  = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "$targetPath.backup-$timestamp"

if ($DryRun) {
    Write-Info ""
    Write-Info "[DryRun] Would back up to: $backupPath"
    Write-Info "[DryRun] Would replace:"
    Write-Info "  OLD: $old"
    Write-Info "  NEW: $new"
    Write-Host ""
    Write-Info "Re-run without -DryRun to apply."
    exit 0
}

Copy-Item -Path $targetPath -Destination $backupPath -Force
Write-Ok "Backed up: $backupPath"

$content = $content.Replace($old, $new)
Set-Content -Path $targetPath -Value $content -Encoding UTF8 -NoNewline
Write-Ok "Updated: hardcoded path replaced with prop usage"

# ── Verify ──────────────────────────────────────────────────
$verifyContent = Get-Content $targetPath -Raw
if ($verifyContent.Contains($new) -and -not $verifyContent.Contains($old)) {
    Write-Ok "Verified: change applied correctly"
} else {
    Write-Fail "Verification failed - file may be in unexpected state"
    Write-Fail "Restore from backup if needed: $backupPath"
    exit 1
}

# ── Git ─────────────────────────────────────────────────────
if ($Commit -or $Push) {
    Write-Host ""
    git add $targetPath 2>&1 | Out-Null
    git commit -m "Fix mobile header logo: use logoUrl prop instead of hardcoded s1" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "git commit failed"
        exit 1
    }
    Write-Ok "Committed."

    if ($Push) {
        git push 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Fail "git push failed"
            exit 1
        }
        Write-Ok "Pushed. Vercel deploying."
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor White
Write-Host ""
Write-Info "After deploy, test on phone in PRIVATE/INCOGNITO browsing"
Write-Info "(Safari caches logos aggressively)"
Write-Host ""
Write-Info "Expected results:"
Write-Host "  - prestigeapparelgroup.com mobile -> Prestige logo" -ForegroundColor Gray
Write-Host "  - imperialaccessories.com mobile -> Imperial logo" -ForegroundColor Gray
Write-Host ""
