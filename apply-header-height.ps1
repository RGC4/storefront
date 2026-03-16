# =============================================================
# apply-header-height.ps1
# Increases the header height and logo size for a more
# professional look.
#
# Run from the ROOT of your project:
#   PowerShell -ExecutionPolicy Bypass -File "C:\dev\s1\apply-header-height.ps1"
# =============================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Fail  { param($msg) Write-Host "[FAIL]  $msg" -ForegroundColor Red }

Info "Applying header height update..."
Info "Project root: $root"

# -----------------------------------------------------------------
# 1. Update src/utils/constants.ts — increase header height
# -----------------------------------------------------------------
$constantsPath = Join-Path $root "src\utils\constants.ts"

if (-not (Test-Path $constantsPath)) {
    Fail "File not found: $constantsPath"
    exit 1
}

$constantsContent = @'
export const layoutConstant = {
  topbarHeight: 40,
  headerHeight: 100,
  mobileNavHeight: 64,
  containerWidth: 1200,
  mobileHeaderHeight: 70,
  grocerySidenavWidth: 280
};
'@

Set-Content -Path $constantsPath -Value $constantsContent -Encoding UTF8
Pass "Updated: $constantsPath"

# -----------------------------------------------------------------
# 2. Update src/components/header/header.tsx — increase logo size
# -----------------------------------------------------------------
$headerPath = Join-Path $root "src\components\header\header.tsx"

if (-not (Test-Path $headerPath)) {
    Fail "File not found: $headerPath"
    exit 1
}

$headerContent = @'
import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
// CUSTOM COMPONENT
import LazyImage from "components/LazyImage";
import { HeaderCategoryDropdown } from "./header-category-dropdown";
// STYLED COMPONENTS
import { HeaderWrapper, StyledContainer } from "./styles";

// ==============================================================
interface HeaderProps extends ComponentProps<typeof HeaderWrapper> {
  mobileHeader: ReactNode;
}
// ==============================================================

export function Header({ children, mobileHeader, ...props }: HeaderProps) {
  return (
    <HeaderWrapper {...props}>
      <StyledContainer>
        <div className="main-header">{children}</div>
        <div className="mobile-header">{mobileHeader}</div>
      </StyledContainer>
    </HeaderWrapper>
  );
}

// ==============================================================
interface HeaderLeftProps extends ComponentProps<typeof Box> {}
// ==============================================================

Header.Left = function ({ children, ...props }: HeaderLeftProps) {
  return (
    <Box display="flex" minWidth={100} alignItems="center" {...props}>
      {children}
    </Box>
  );
};

// ==============================================================
interface HeaderLogoProps {
  url: string;
}
// ==============================================================

Header.Logo = function ({ url }: HeaderLogoProps) {
  return (
    <Link href="/">
      <LazyImage
        priority
        src={url}
        alt="logo"
        width={180}
        height={80}
        sizes="(max-width: 768px) 130px, 180px"
        sx={{ objectFit: "contain" }}
      />
    </Link>
  );
};

Header.CategoryDropdown = function ({ children }: PropsWithChildren) {
  return <HeaderCategoryDropdown>{children}</HeaderCategoryDropdown>;
};

Header.Mid = function ({ children }: PropsWithChildren) {
  return children;
};

// ==============================================================
interface HeaderRightProps extends ComponentProps<typeof Box> {}
// ==============================================================

Header.Right = function ({ children, ...props }: HeaderRightProps) {
  return <Box {...props}>{children}</Box>;
};
'@

Set-Content -Path $headerPath -Value $headerContent -Encoding UTF8
Pass "Updated: $headerPath"

# -----------------------------------------------------------------
# Done
# -----------------------------------------------------------------
Write-Host ""
Pass "Header update complete! 2 files changed:"
Write-Host "  - src\utils\constants.ts              (headerHeight: 52 -> 100, mobileHeaderHeight: 52 -> 70)" -ForegroundColor White
Write-Host "  - src\components\header\header.tsx    (logo: 105x50 -> 180x80)" -ForegroundColor White
Write-Host ""
Info "Restart your dev server to see the changes."
