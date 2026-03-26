param(
    [string]$SourceDir = "$env:USERPROFILE\Downloads",
    [string]$ProjectRoot = "C:\dev\s1"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Shopify Auth Deployer - Prestige Apparel Group" -ForegroundColor Cyan
Write-Host "Source  : $SourceDir" -ForegroundColor White
Write-Host "Project : $ProjectRoot" -ForegroundColor White
Write-Host ""

if (-not (Test-Path $SourceDir)) {
    Write-Host "ERROR: Source folder not found: $SourceDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ProjectRoot)) {
    Write-Host "ERROR: Project folder not found: $ProjectRoot" -ForegroundColor Red
    exit 1
}

$files = [ordered]@{
    "shopify-auth.ts"  = "src\lib\shopify-auth.ts"
    "proxy.ts"         = "src\proxy.ts"
    "useAuth.ts"       = "src\hooks\useAuth.ts"
    "login.tsx"        = "src\pages-sections\sessions\page-view\login.tsx"
    "route.ts"         = "src\app\api\auth\login\route.ts"
    "route (1).ts"     = "src\app\api\auth\callback\route.ts"
    "route (2).ts"     = "src\app\api\auth\session\route.ts"
    "route (3).ts"     = "src\app\api\auth\logout\route.ts"
}

$success = 0
$skipped = 0
$failed  = 0

foreach ($entry in $files.GetEnumerator()) {
    $srcFile  = Join-Path $SourceDir $entry.Key
    $destFile = Join-Path $ProjectRoot $entry.Value
    $destDir  = Split-Path $destFile -Parent

    if (-not (Test-Path $srcFile)) {
        Write-Host "  SKIP  $($entry.Key) - not found in $SourceDir" -ForegroundColor Yellow
        $skipped++
        continue
    }

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        Write-Host "  MKDIR $destDir" -ForegroundColor DarkGray
    }

    if (Test-Path $destFile) {
        Copy-Item $destFile "$destFile.bak" -Force
        Write-Host "  BAK   $($entry.Value)" -ForegroundColor DarkGray
    }

    try {
        Copy-Item $srcFile $destFile -Force
        Write-Host "  OK    $($entry.Value)" -ForegroundColor Green
        $success++
    } catch {
        Write-Host "  FAIL  $($entry.Value) - $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Done. Copied: $success  Skipped: $skipped  Failed: $failed" -ForegroundColor Cyan
Write-Host ""
