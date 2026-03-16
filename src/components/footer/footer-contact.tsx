"use client";

import { Fragment, useState } from "react";
import { Heading, StyledLink } from "./styles";
import ContactModal from "components/contact-modal";

interface Props {
  email: string;
  phone: string;
  address: string;
}

export function FooterContact({ email, phone, address }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Fragment>
      <Heading>Contact Us</Heading>

      {address && (
        <StyledLink href="#">
          {address}
        </StyledLink>
      )}

      {email && (
        <>
          {/* Email opens the contact form modal instead of mailto */}
          <StyledLink
            href="#"
            onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
          >
            Email: {email}
          </StyledLink>

          <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      )}

      {phone && (
        <StyledLink href={`tel:${phone.replace(/\D/g, "")}`}>
          Phone: {phone}
        </StyledLink>
      )}
    </Fragment>
  );
}
