import Link from "next/link";
import LazyImage from "components/LazyImage";
// STYLED COMPONENT
import { StyledButton, StyledRoot } from "./styles";

  image: string;
  url?: string;
}
  return (
    <StyledRoot>
      <LazyImage
        src={image}
        alt="Story"
        width={450}
        height={824}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        quality={85}
      />

      <StyledButton color="primary" variant="contained" LinkComponent={Link} href={url}>
        View More
      </StyledButton>
    </StyledRoot>
  );
}
