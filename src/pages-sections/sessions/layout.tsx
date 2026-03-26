import { PropsWithChildren, ReactNode } from "react";
// LOCAL CUSTOM COMPONENTS
import LogoWithTitle from "./components/logo-title";
// GLOBAL CUSTOM COMPONENTS
import FlexRowCenter from "components/flex-box/flex-row-center";
// COMMON STYLED COMPONENT
import { Wrapper } from "./styles";

// ==============================================================
interface Props extends PropsWithChildren {
  bottomContent: ReactNode;
}
// ==============================================================

export default function AuthLayout({ children, bottomContent }: Props) {
  return (
    // pb ensures the fixed mobile bottom nav doesn't overlap the form
    <FlexRowCenter
      bgcolor="grey.50"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      pb={{ xs: "80px", lg: 0 }}
    >
      <Wrapper elevation={6}>
        <LogoWithTitle />
        {children}
        {bottomContent}
      </Wrapper>
    </FlexRowCenter>
  );
}
