"use client";

import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Footer1, FooterLinksWidget
} from "components/footer";
import { MobileNavigationBar } from "components/mobile-navigation";
import { SearchInput2 } from "components/search-box";
import { HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";
import LayoutModel from "models/Layout.model";

interface Props extends PropsWithChildren { data: LayoutModel; }

const HEADER_LOGO_URL = "/assets/stores/s1/logo/logo-header.png";
const FOOTER_LOGO_URL = "/assets/stores/s1/logo/logo-footer.png";

const NAV_LINK_STYLE: React.CSSProperties = {
  fontSize: "1.08rem",
  fontWeight: 600,
  color: "#1a1a2e",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  whiteSpace: "nowrap",
  padding: "4px 0",
  borderBottom: "2px solid transparent",
  transition: "border-color 200ms ease, color 200ms ease",
};

export default function ShopLayout1({ children, data }: Props) {
  const { footer, header, mobileNavigation } = data;
  const [scrolled, setScrolled] = useState(false);
  const policies = (footer as any).policies || [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const MOBILE_VERSION_HEADER = (
    <MobileHeader>
      <MobileHeader.Left>
        <MobileHeader.Logo logoUrl={HEADER_LOGO_URL} />
      </MobileHeader.Left>
      <MobileHeader.Right>
        <HeaderSearch><SearchInput2 /></HeaderSearch>
        <HeaderLogin />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  );

  return (
    <Fragment>

      {/* STICKY HEADER */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: scrolled ? "none" : "1px solid #f0f0f0",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 300ms ease, border-bottom 300ms ease",
        height: 100,
      }}>

        {/* DESKTOP HEADER */}
        <div className="main-header" style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: "24px",
          paddingRight: "24px",
          gap: "2rem",
        }}>

          {/* LOGO */}
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image
              src={HEADER_LOGO_URL}
              alt="Store Logo"
              width={322}
              height={109}
              priority
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </Link>

          {/* NAV */}
          <nav style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            flexWrap: "nowrap",
            marginLeft: "auto",
          }}>
            <Link
              href="/"
              style={NAV_LINK_STYLE}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.borderBottomColor = "#b8972e";
                (e.target as HTMLElement).style.color = "#b8972e";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.borderBottomColor = "transparent";
                (e.target as HTMLElement).style.color = "#1a1a2e";
              }}
            >
              Home
            </Link>
            {header.categoryMenus?.map((cat: any) => (
              <Link
                key={cat.value}
                href={`/collections/${cat.value}`}
                style={NAV_LINK_STYLE}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.borderBottomColor = "#b8972e";
                  (e.target as HTMLElement).style.color = "#b8972e";
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.borderBottomColor = "transparent";
                  (e.target as HTMLElement).style.color = "#1a1a2e";
                }}
              >
                {cat.title}
              </Link>
            ))}
          </nav>

          {/* ICONS */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: "1.75rem", display: "flex", alignItems: "center" }}>
              <HeaderLogin />
            </div>
            <div style={{ fontSize: "1.75rem", display: "flex", alignItems: "center" }}>
              <HeaderCart />
            </div>
          </div>

        </div>

        {/* MOBILE HEADER */}
        <div className="mobile-header" style={{ display: "none", height: "100%" }}>
          {MOBILE_VERSION_HEADER}
        </div>

      </div>

      {/* Responsive: swap desktop/mobile header at 768px */}
      <style>{`
        @media (max-width: 768px) {
          .main-header { display: none !important; }
          .mobile-header { display: flex !important; align-items: center; padding: 0 16px; }
        }
      `}</style>

      {children}

      <MobileNavigationBar navigation={mobileNavigation.version1} />

      {/* FOOTER */}
      <Box component="footer" bgcolor="grey.900" color="white" mb={{ lg: 0, xs: 8 }} pt={{ sm: 4, xs: 2 }}>
        <Container>
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 4, md: 0 },
            py: 2,
          }}>
            {/* LOGO - flush left */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 220px" }, mr: { md: "auto" } }}>
              <Link href="/">
                <Image src={FOOTER_LOGO_URL} alt="Store Logo" width={200} height={82}
                  style={{ objectFit: "contain", objectPosition: "left center" }} />
              </Link>
            </Box>

            {/* 3 LINK COLUMNS - centered */}
            <Box sx={{
              display: "flex",
              flex: { xs: "1 1 100%", md: "0 0 auto" },
              gap: { xs: 4, md: 8 },
              flexWrap: "wrap",
              justifyContent: { md: "center" },
            }}>
              <Box sx={{ minWidth: 160 }}>
                <FooterLinksWidget title="About Us" links={footer.about} />
              </Box>
              <Box sx={{ minWidth: 160 }}>
                <FooterLinksWidget title="Customer Care" links={footer.customers} />
              </Box>
              <Box sx={{ minWidth: 160 }}>
                <FooterLinksWidget title="Policies" links={policies} />
              </Box>
            </Box>
          </Box>

          {/* COPYRIGHT */}
          <Divider sx={{ borderColor: "grey.800", mt: 2 }} />
          <Typography
            variant="body2"
            sx={{ py: 2, textAlign: "center", fontSize: "1.01rem", color: "grey.400" }}
          >
            &copy; Copyright {new Date().getFullYear()}{" "}
            <span style={{ fontWeight: 600, color: "white" }}>Prestige Apparel Group</span>.{" "}
            Owned and operated by RGC4.{" "}
            All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Fragment>
  );
}
