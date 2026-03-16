import Link from "next/link";
import Typography from "@mui/material/Typography";
import LazyImage from "components/LazyImage";
import { ImageContainer, StyledRoot } from "./styles";

  image: string;
  title: string;
  slug: string;
}
  return (
    <Link href={`/products/search?category=${slug}`}>
      <StyledRoot>
        <ImageContainer>
          <LazyImage alt={title} width={180} height={180} src={image} className="category-image" />
        </ImageContainer>

        <Typography variant="body1" fontSize={17} fontWeight={500} className="title">
          {title}
        </Typography>
      </StyledRoot>
    </Link>
  );
}
