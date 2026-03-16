export interface StoreConfig {
  storeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  domain: string;
  logo: string;
  logoHeader: string;
  logoFooter: string;
  primaryColor: string;
  secondaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  footerDescription: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    google: string;
  };
}

export const defaultStoreConfig: StoreConfig = {
  storeId: "s1",
  name: "Prestige Apparel Group",
  email: "info@prestigeapparelgroup.com",
  phone: "",
  address: "",
  domain: "www.prestigeapparelgroup.com",
  logo: "/assets/stores/s1/logo/logo-header.png",
  logoHeader: "/assets/stores/s1/logo/logo-header.png",
  logoFooter: "/assets/stores/s1/logo/logo-footer.png",
  primaryColor: "#D23F57",
  secondaryColor: "#2B3445",
  heroTitle: "New Collection",
  heroSubtitle: "Free shipping on orders over $99",
  heroButtonText: "Shop Now",
  heroButtonLink: "/collections",
  footerDescription: "Your destination for luxury designer bags and fashion.",
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    google: "",
  },
};
