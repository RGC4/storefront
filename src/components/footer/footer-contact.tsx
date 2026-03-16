<<<<<<< HEAD
"use client";

import { Fragment, useState } from "react";
import { Heading, StyledLink } from "./styles";
import ContactModal from "components/contact-modal";

=======
import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import { Heading } from "./styles";

// ==============================================================
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
interface Props {
  email: string;
  phone: string;
  address: string;
}
<<<<<<< HEAD

export function FooterContact({ email, phone, address }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

=======
// ==============================================================

export function FooterContact({ email, phone, address }: Props) {
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  return (
    <Fragment>
      <Heading>Contact Us</Heading>

<<<<<<< HEAD
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
=======
      <Typography variant="body1" sx={{ py: 0.6 }}>
        {address}
      </Typography>

      <Typography variant="body1" sx={{ py: 0.6 }}>
        Email: {email}
      </Typography>

      <Typography variant="body1" sx={{ py: 0.6, mb: 2 }}>
        Phone: {phone}
      </Typography>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    </Fragment>
  );
}
