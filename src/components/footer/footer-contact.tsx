import { Fragment } from "react";
import { Heading, StyledLink } from "./styles";

interface Props {
  email: string;
  phone: string;
  address: string;
}

export function FooterContact({ email, address }: Props) {
  return (
    <Fragment>
      <Heading>Contact Us</Heading>

      {address && (
        <StyledLink href="#">
          {address}
        </StyledLink>
      )}

      {email && (
        <StyledLink href="/contact">
          Email: {email}
        </StyledLink>
      )}
    </Fragment>
  );
}
