import { PropsWithChildren, ReactNode } from "react";
import Container from "@mui/material/Container";
// STYLED COMPONENTS
import { ContentWrapper } from "./styles";

  SideNav: ReactNode;
  className?: string;
}
  return (
    <Container>
      <ContentWrapper className={className}>
        <div className="sidebar">{SideNav}</div>
        <div className="content">{children}</div>
      </ContentWrapper>
    </Container>
  );
}
