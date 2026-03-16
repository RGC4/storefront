"use client";

import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  Footer1, FooterContact, FooterLinksWidget, FooterSocialLinks
} from "components/footer";
import { MobileMenu } from "components/mobile-navbar";
import { MobileNavigationBar } from "components/mobile-navigation";
import { SearchInput2 } from "components/search-box";
import { Topbar, TopbarLanguageSelector, TopbarSocialLinks } from "components/topbar";
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";
import LayoutModel from "models/Layout.model";

interface Props extends PropsWithChildren { data: LayoutModel; }

const HEADER_LOGO_URL = "/assets/stores/s1/logo/logo-header.png";
const FOOTER_LOGO_URL = "/assets/stores/s1/logo/logo-footer.png";

const NAV_LINK_STYLE: React.CSSProperties = {
  fontSize: "1.08rem",     // ~17px — 15% larger than 15px
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
      <MobileHeader.Logo logoUrl={HEADER_LOGO_URL} />
      <MobileHeader.Right>
        <HeaderSearch><SearchInput2 /></HeaderSearch>
        <HeaderLogin />
        <HeaderCart />
      </MobileHeader.Right>
    </MobileHeader>
  );

  const filteredCustomers = footer.customers?.filter(
    (item: { title: string; url: string }) =>
      item.title !== "Corporate & Bulk Orders"
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

        {/* DESKTOP HEADER — plain div, no MUI Container, logo at true far-left */}
        <div className="main-header" style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: "24px",
          paddingRight: "24px",
          gap: "2rem",
        }}>

          {/* LOGO — far left */}
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

          {/* NAV — pushed right via marginLeft: auto */}
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

          {/* ICONS — right */}
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

      {/* Responsive: swap desktop/mobile header at 1150px */}
      <style>{`
        @media (max-width: 1150px) {
          .main-header { display: none !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>

      {children}

      <MobileNavigationBar navigation={mobileNavigation.version1} />

      <Footer1>
        <Footer1.Brand>
          <Link href="/">
            <Image src={FOOTER_LOGO_URL} alt="Store Logo" width={360} height={147}
              style={{ objectFit: "contain", objectPosition: "left center" }} />
          </Link>
        </Footer1.Brand>
        <Footer1.Widget1><FooterLinksWidget title="About Us" links={footer.about} /></Footer1.Widget1>
        <Footer1.Widget2><FooterLinksWidget title="Customer Care" links={filteredCustomers} /></Footer1.Widget2>
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
