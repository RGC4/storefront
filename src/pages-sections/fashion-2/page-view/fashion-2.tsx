import { Fragment } from "react";
import Newsletter from "components/newsletter";
import Section1 from "../section-1";
import Section2 from "../section-2";
import Section3 from "../section-3";
import Section4 from "../section-4";
import Section6 from "../section-6";
import Section7 from "../section-7";
import Section9 from "../section-9";

export default function FashionTwoPageView() {
  return (
    <Fragment>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section6 />
      <Section7 />
      <Section9 />
      <Newsletter />
    </Fragment>
  );
}