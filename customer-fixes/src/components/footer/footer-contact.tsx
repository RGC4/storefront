import { Fragment } from "react";
import { Heading, StyledLink } from "./styles";

interface Props {
  email: string;
  phone: string;
  address: string;
}

export function FooterContact({ email, phone, address }: Props) {
  return (
    <Fragment>
      <Heading>Contact Us</Heading>

      {address && (
        <StyledLink href="#" style={{ pointerEvents: "none" }}>
          {address}
        </StyledLink>
      )}

      {email && (
        <StyledLink href={`mailto:${email}`}>
          Email: {email}
        </StyledLink>
      )}

      {phone && (
        <StyledLink href={`tel:${phone.replace(/\D/g, "")}`}>
          Phone: {phone}
        </StyledLink>
      )}
    </Fragment>
  );
}
