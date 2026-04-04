"use client";

import { Fragment, PropsWithChildren, useEffect, useState } from "react";
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

const STORE_ID        = process.env.NEXT_PUBLIC_STORE_ID || "s1";
const HEADER_LOGO_URL = `/assets/stores/${STORE_ID}/logo/logo-header.png`;
const FOOTER_LOGO_URL = `/assets/stores/${STORE_ID}/logo/logo-footer.png`;

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
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: scrolled ? "none" : "1px solid #f0f0f0",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.10)" : "none",
        transition: "box-shadow 300ms ease, border-bottom 300ms ease",
        height: 100,
      }}>
        <div className="main-header" style={{
          display: "flex", alignItems: "center", height: "100%",
          paddingLeft: "24px", paddingRight: "24px", gap: "2rem",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, height: "100%" }}>
            <Image src={HEADER_LOGO_URL} alt={`${storeConfig.name} Logo`}
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
        <div className="mobile-header" style={{ display: "none", height: "100%" }}>
          {MOBILE_VERSION_HEADER}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-header { display: none !important; }
          .mobile-header { display: flex !important; align-items: center; padding: 0 16px; }
        }
      `}</style>

      {children}

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
          <Typography variant="caption" component="p" sx={{ py: 2.5, textAlign: "center", color: "grey.500" }}>
            &copy; {new Date().getFullYear()}{" "}
            <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{storeConfig.name}</span>.{" "}
            Owned and operated by RGC4. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Fragment>
  );
}
