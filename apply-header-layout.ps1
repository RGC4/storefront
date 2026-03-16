# =============================================================
# apply-header-layout.ps1
# Moves the logo into the header bar and increases header height
# for a professional look.
#
# Run with:
#   PowerShell -ExecutionPolicy Bypass -File "C:\dev\s1\apply-header-layout.ps1"
# =============================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Fail  { param($msg) Write-Host "[FAIL]  $msg" -ForegroundColor Red }

Info "Applying header layout update..."
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
# 2. Update src/components/layouts/shop-layout-1/shop-layout-1.tsx
#    — add logo to header, use logo.png
# -----------------------------------------------------------------
$layoutPath = Join-Path $root "src\components\layouts\shop-layout-1\shop-layout-1.tsx"

if (-not (Test-Path $layoutPath)) {
    Fail "File not found: $layoutPath"
    exit 1
}

$layoutContent = @'
"use client";

import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  Footer1, FooterApps, FooterContact, FooterLinksWidget, FooterSocialLinks
} from "components/footer";
import { MobileMenu } from "components/mobile-navbar";
import { MobileNavigationBar } from "components/mobile-navigation";
import { SearchInput2 } from "components/search-box";
import { Topbar, TopbarLanguageSelector, TopbarSocialLinks } from "components/topbar";
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";
import LayoutModel from "models/Layout.model";

interface Props extends PropsWithChildren { data: LayoutModel; }

const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/assets/stores/s1/logo/logo.png";

export default function ShopLayout1({ children, data }: Props) {
  const { footer, header, topbar, mobileNavigation } = data;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const MOBILE_VERSION_HEADER = (
    <MobileHeader>
      <MobileHeader.Left>
        <MobileMenu navigation={header.navigation} />
      </MobileHeader.Left>
      <MobileHeader.Logo logoUrl={mobileNavigation.logo} />
      <MobileHeader.Right>
        <HeaderSearch><SearchInput2 /></HeaderSearch>
        <HeaderLogin />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  );

  return (
    <Fragment>
      <Topbar>
        <Topbar.Left label={topbar.label} title={topbar.title} />
        <Topbar.Right>
          <TopbarLanguageSelector languages={topbar.languageOptions} />
          <TopbarSocialLinks links={topbar.socials} />
        </Topbar.Right>
      </Topbar>

      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "white",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        transition: "box-shadow 300ms ease",
      }}>
        {/* @ts-ignore — data-transparent is a valid HTML attribute */}
        <Header mobileHeader={MOBILE_VERSION_HEADER} data-transparent={String(!scrolled)}>

          {/* LOGO */}
          <Header.Left>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src={LOGO_URL}
                alt="Store Logo"
                width={200}
                height={80}
                priority
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </Link>
          </Header.Left>

          {/* NAV LINKS */}
          <Header.Mid>
            <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link
                href="/"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#2B3445",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}
              >
                Home
              </Link>
              {header.categoryMenus?.map((cat: any) => (
                <Link
                  key={cat.value}
                  href={`/collections/${cat.value}`}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#2B3445",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.title}
                </Link>
              ))}
            </nav>
          </Header.Mid>

          {/* RIGHT ICONS */}
          <Header.Right>
            <HeaderLogin />
            <HeaderCart />
          </Header.Right>

        </Header>
      </div>

      {children}

      <MobileNavigationBar navigation={mobileNavigation.version1} />

      <Footer1>
        <Footer1.Brand>
          <Link href="/">
            <Image src={LOGO_URL} alt="Store Logo" width={140} height={60}
              style={{ objectFit: "contain", objectPosition: "left center" }} />
          </Link>
          <Typography variant="body1" sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}>
            {footer.description}
          </Typography>
          <FooterApps playStoreUrl={footer.playStoreUrl} appleStoreUrl={footer.appStoreUrl} />
        </Footer1.Brand>
        <Footer1.Widget1><FooterLinksWidget title="About Us" links={footer.about} /></Footer1.Widget1>
        <Footer1.Widget2><FooterLinksWidget title="Customer Care" links={footer.customers} /></Footer1.Widget2>
        <Footer1.Contact>
          <FooterContact phone={footer.contact.phone} email={footer.contact.email} address={footer.contact.address} />
          <FooterSocialLinks links={footer.socials} />
        </Footer1.Contact>
        <Footer1.Copyright>
          <Divider sx={{ borderColor: "grey.800" }} />
          <Typography variant="body2" sx={{ py: 3, textAlign: "center", span: { fontWeight: 500 } }}>
            &copy; Copyright {new Date().getFullYear()} <span>Prestige Apparel Group</span>. All rights reserved.
          </Typography>
        </Footer1.Copyright>
      </Footer1>
    </Fragment>
  );
}
'@

Set-Content -Path $layoutPath -Value $layoutContent -Encoding UTF8
Pass "Updated: $layoutPath"

# -----------------------------------------------------------------
# Done
# -----------------------------------------------------------------
Write-Host ""
Pass "Header layout update complete! 2 files changed:"
Write-Host "  - src\utils\constants.ts                                          (headerHeight: 52 -> 100)" -ForegroundColor White
Write-Host "  - src\components\layouts\shop-layout-1\shop-layout-1.tsx          (logo added to header)" -ForegroundColor White
Write-Host ""
Info "Restart your dev server to see the changes."
