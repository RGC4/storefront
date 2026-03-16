import { Fragment } from "react";
import { Heading, StyledLink } from "./styles";

  isDark?: boolean;
  title: string;
  links: { title: string; url: string }[];
}
  return (
    <Fragment>
      <Heading>{title}</Heading>

      {links.map((item, ind) => (
        <StyledLink href={item.url} key={ind}>
          {item.title}
        </StyledLink>
      ))}
    </Fragment>
  );
}
