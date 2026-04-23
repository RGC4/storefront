"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FooterLinksWidget } from "components/footer";
import { MobileNavigationBar } from "components/mobile-navigation";
import { SearchInput2 } from "components/search-box";
import { HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";
import LayoutModel from "models/Layout.model";
import storeConfig from "config/store.config";

interface Props extends PropsWithChildren { data: LayoutModel; }

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Store";
const STORE_TAGLINE = process.env.NEXT_PUBLIC_STORE_TAGLINE || "";
const HEADER_LOGO_URL = `/assets/stores/${STORE_ID}/logo/logo-header.jpg`;
const FOOTER_LOGO_URL = `/assets/stores/${STORE_ID}/logo/logo-footer.jpg`;

const NAV_LINK_STYLE: React.CSSProperties = {
  fontSize: "14px",
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* STICKY HEADER - position: fixed so it ALWAYS stays on top, all screens */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8e8e8",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 300ms ease",
      }}>
        {/* DESKTOP HEADER */}
        <div className="main-header" style={{
          display: "flex",
          alignItems: "center",
          height: 100,
          paddingLeft: "24px",
          paddingRight: "24px",
          gap: "2rem",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, height: "100%", textDecoration: "none" }}>
            <Image src={HEADER_LOGO_URL} alt={`${STORE_NAME} Logo`}
              width={320} height={117} priority
              style={{ objectFit: "contain", objectPosition: "left center", marginTop: "8px" }} />
          </Link>
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "nowrap", marginLeft: "auto" }}>
            <Link href="/" style={NAV_LINK_STYLE}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderBottomColor = "#b8972e"; (e.target as HTMLElement).style.color = "#b8972e"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderBottomColor = "transparent"; (e.target as HTMLElement).style.color = "#1a1a2e"; }}>
              Home
            </Link>
            {header.categoryMenus?.map((cat: any) => (
              <Link key={cat.value} href={`/collections/${cat.value}`} style={NAV_LINK_STYLE}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderBottomColor = "#b8972e"; (e.target as HTMLElement).style.color = "#b8972e"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderBottomColor = "transparent"; (e.target as HTMLElement).style.color = "#1a1a2e"; }}>
                {cat.title}
              </Link>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <div style={{ fontSize: "2.31rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}><HeaderLogin /></div>
            <div style={{ fontSize: "2.31rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}><HeaderCart /></div>
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="mobile-header" style={{
          display: "none",
          height: 64,
          paddingLeft: "16px",
          paddingRight: "16px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          boxSizing: "border-box",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0, flex: 1, marginRight: "8px" }}>
            <div style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1a1a2e",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              fontFamily: "serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {STORE_NAME}
            </div>
            {STORE_TAGLINE && (
              <div style={{
                fontSize: "9px",
                fontWeight: 500,
                color: "#666",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {STORE_TAGLINE}
              </div>
            )}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <HeaderSearch><SearchInput2 /></HeaderSearch>
            <HeaderLogin />
            <HeaderCart />
          </div>
        </div>
      </div>

      {/* Spacer for fixed header (desktop 100px, mobile 64px) */}
      <div style={{ height: 100, flexShrink: 0 }} className="header-spacer" />

      <style>{`
        @media (max-width: 768px) {
          .main-header { display: none !important; }
          .mobile-header { display: flex !important; }
          .header-spacer { height: 64px !important; }
        }
      `}</style>

      <div style={{ flex: 1 }}>
        {children}
      </div>

      <MobileNavigationBar navigation={mobileNavigation.version1} />

      {/* FOOTER */}
      <Box component="footer" bgcolor="grey.900" color="white" mb={{ lg: 0, xs: 8 }} pt={{ sm: 5, xs: 3 }}>
        <Container>
          <Grid container spacing={4} sx={{ pb: 5, justifyContent: "space-around", textAlign: "center" }}>

            <Grid size={{ xs: 12, md: 4 }}>
              <FooterLinksWidget title="About Us" links={footer.about} />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <FooterLinksWidget title="Customer Care" links={footer.customers} />
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <FooterLinksWidget title="Policies" links={policies} />
            </Grid>

          </Grid>
          <Divider sx={{ borderColor: "grey.800" }} />
          <Typography component="p" sx={{ py: 2.5, textAlign: "center", color: "grey.500", fontSize: "0.825rem" }}>
            &copy; {new Date().getFullYear()}{" "}
            <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{storeConfig.name}</span>.{" "}
            Owned and operated by RGC4 - a U.S. based company. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </div>
  );
}