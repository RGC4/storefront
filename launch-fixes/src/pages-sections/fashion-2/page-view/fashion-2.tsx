import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import Newsletter from "components/newsletter";
// LOCAL CUSTOM COMPONENTS
import Section1 from "../section-1";
import Section2 from "../section-2";
import Section3 from "../section-3";
import Section4 from "../section-4";
// import Section5 from "../section-5";
import Section6 from "../section-6";
import Section7 from "../section-7";
import Section9 from "../section-9";

export default function FashionTwoPageView() {
  return (
    <Fragment>
      {/* HERO SECTION CAROUSEL */}
      <Section1 />

      {/* SERVICE CARDS */}
      <Section2 />

      {/* BEST SELLING CATEGORIES */}
      <Section3 />

      {/* BEST SELLING PRODUCTS */}
      <Section4 />

      {/* OFFER BANNERS — uncomment when banner images are ready */}
      {/* <Section5 /> */}

      {/* FEATURED PRODUCTS */}
      <Section6 />

      {/* SUMMER SALE OFFER AREA */}
      <Section7 />

      {/* BRAND LIST CAROUSEL */}
      <Section9 />

      {/* POPUP NEWSLETTER FORM */}
      <Newsletter />

      {/* Setting widget removed — was a demo-only component */}
    </Fragment>
  );
}
