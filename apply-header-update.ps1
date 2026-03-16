# =============================================================
# apply-header-update.ps1
# Professional luxury header:
#   - Topbar removed
#   - Logo left, nav centered (scales to 10 collections), icons right
#   - Clean hero video with no overlapping elements
#   - Subtle scroll shadow
#
# Run with:
#   PowerShell -ExecutionPolicy Bypass -File "C:\dev\s1\apply-header-update.ps1"
# =============================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Info  { param($msg) Write-Host "[INFO]  $msg" -ForegroundColor Cyan }
function Pass  { param($msg) Write-Host "[PASS]  $msg" -ForegroundColor Green }
function Fail  { param($msg) Write-Host "[FAIL]  $msg" -ForegroundColor Red }

Info "Applying professional header update..."
Info "Project root: $root"

# -----------------------------------------------------------------
# 1. src/utils/constants.ts — generous header height
# -----------------------------------------------------------------
$constantsPath = Join-Path $root "src\utils\constants.ts"
if (-not (Test-Path $constantsPath)) { Fail "File not found: $constantsPath"; exit 1 }

Set-Content -Path $constantsPath -Encoding UTF8 -Value @'
export const layoutConstant = {
  topbarHeight: 0,
  headerHeight: 90,
  mobileNavHeight: 64,
  containerWidth: 1400,
  mobileHeaderHeight: 70,
  grocerySidenavWidth: 280
};
'@
Pass "Updated: $constantsPath"

# -----------------------------------------------------------------
# 2. src/components/layouts/shop-layout-1/shop-layout-1.tsx
#    — no topbar, logo left, scaled nav, clean icons right
# -----------------------------------------------------------------
$layoutPath = Join-Path $root "src\components\layouts\shop-layout-1\shop-layout-1.tsx"
if (-not (Test-Path $layoutPath)) { Fail "File not found: $layoutPath"; exit 1 }

Set-Content -Path $layoutPath -Encoding UTF8 -Value @'
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
  const { footer, header, mobileNavigation } = data;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const MOBILE_VERSION_HEADER = (
    <MobileHeader>
      <MobileHeader.Left>
        <MobileMenu navigation={header.navigation} />
      </MobileHeader.Left>
      <MobileHeader.Logo logoUrl={LOGO_URL} />
      <MobileHeader.Right>
        <HeaderSearch><SearchInput2 /></HeaderSearch>
        <HeaderLogin />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  );

  return (
    <Fragment>

      {/* STICKY HEADER — no topbar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: scrolled ? "none" : "1px solid #f0f0f0",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 300ms ease, border-bottom 300ms ease",
      }}>
        {/* @ts-ignore */}
        <Header mobileHeader={MOBILE_VERSION_HEADER} data-transparent="false">

          {/* LOGO — left */}
          <Header.Left style={{ minWidth: 240, flexShrink: 0 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", paddingLeft: "16px" }}>
              <Image
                src={LOGO_URL}
                alt="Store Logo"
                width={220}
                height={75}
                priority
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </Link>
          </Header.Left>

          {/* NAV — centered, scales naturally with more links */}
          <Header.Mid>
            <nav style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              flexWrap: "nowrap",
            }}>
              <Link href="/" style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#1a1a2e",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
                padding: "4px 0",
                borderBottom: "2px solid transparent",
                transition: "border-color 200ms ease, color 200ms ease",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderBottomColor = "#b8972e"; (e.target as HTMLElement).style.color = "#b8972e"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderBottomColor = "transparent"; (e.target as HTMLElement).style.color = "#1a1a2e"; }}
              >
                Home
              </Link>
              {header.categoryMenus?.map((cat: any) => (
                <Link
                  key={cat.value}
                  href={`/collections/${cat.value}`}
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                    padding: "4px 0",
                    borderBottom: "2px solid transparent",
                    transition: "border-color 200ms ease, color 200ms ease",
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderBottomColor = "#b8972e"; (e.target as HTMLElement).style.color = "#b8972e"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderBottomColor = "transparent"; (e.target as HTMLElement).style.color = "#1a1a2e"; }}
                >
                  {cat.title}
                </Link>
              ))}
            </nav>
          </Header.Mid>

          {/* ICONS — right */}
          <Header.Right style={{
            minWidth: 240,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.25rem",
            paddingRight: "16px",
          }}>
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
            <Image src={LOGO_URL} alt="Store Logo" width={160} height={65}
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
Pass "Updated: $layoutPath"

# -----------------------------------------------------------------
# 3. src/pages-sections/fashion-2/section-1/hero-carousel.tsx
#    — remove logo overlay, remove negative marginTop
# -----------------------------------------------------------------
$heroPath = Join-Path $root "src\pages-sections\fashion-2\section-1\hero-carousel.tsx"
if (-not (Test-Path $heroPath)) { Fail "File not found: $heroPath"; exit 1 }

Set-Content -Path $heroPath -Encoding UTF8 -Value @'
"use client";

import { useEffect, useRef, useState } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const VIDEOS = [
  { src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4` },
  { src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4` },
  { src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4` },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [current]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % VIDEOS.length);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(400px, 75vw, 1100px)",
      overflow: "hidden",
      backgroundColor: "#111",
    }}>
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        muted
        playsInline
        autoPlay
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 15%",
        }}
      >
        <source src={VIDEOS[current].src} type="video/mp4" />
      </video>
    </div>
  );
}
'@
Pass "Updated: $heroPath"

# -----------------------------------------------------------------
# Done
# -----------------------------------------------------------------
Write-Host ""
Pass "Professional header update complete! 3 files changed:"
Write-Host "  - src\utils\constants.ts                                         (topbarHeight: 0, headerHeight: 90)" -ForegroundColor White
Write-Host "  - src\components\layouts\shop-layout-1\shop-layout-1.tsx         (topbar removed, logo left, nav scales)" -ForegroundColor White
Write-Host "  - src\pages-sections\fashion-2\section-1\hero-carousel.tsx       (clean hero, no logo overlay)" -ForegroundColor White
Write-Host ""
Info "Restart your dev server to see the changes."
