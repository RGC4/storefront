<<<<<<< HEAD
import Link from "next/link";
import LazyImage from "components/LazyImage";
import { CategoryTitle, Wrapper } from "./styles";

interface Props {
  image: string;
  title: string;
  href?: string;
}

export default function CategoryCard1({ image, title, href = "#" }: Props) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <Wrapper>
        {image && (
          <LazyImage src={image} width={213} height={213} alt="category" />
        )}
        <CategoryTitle className="category-title">
          <p>{title}</p>
        </CategoryTitle>
      </Wrapper>
    </Link>
=======
import LazyImage from "components/LazyImage";
import { CategoryTitle, Wrapper } from "./styles";

// ============================================================
interface Props {
  image: string;
  title: string;
}
// ============================================================

export default function CategoryCard1({ image, title }: Props) {
  return (
    <Wrapper>
      <LazyImage src={image} width={213} height={213} alt="category" />

      <CategoryTitle className="category-title">
        <p>{title}</p>
      </CategoryTitle>
    </Wrapper>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
