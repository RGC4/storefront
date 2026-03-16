import { ComponentProps } from "react";
// STYLED COMPONENTS
import { LeftContent, RightContent, StyledChip, StyledContainer, StyledRoot } from "./styles";

  return (
    <StyledRoot bgColor={bgColor} {...props}>
      <StyledContainer>{children}</StyledContainer>
    </StyledRoot>
  );
}

  label: string;
  title: string;
}
// ===================================================================

Topbar.Left = function ({ label, title, children, ...props }: TopbarLeftProps) {
  return (
    <LeftContent {...props}>
      <div className="tag">
        <StyledChip label={label} size="small" />
        <span>{title}</span>
      </div>
    </LeftContent>
  );
};

// ======================================================================

Topbar.Right = function ({ children, ...props }: TopbarRightProps) {
  return <RightContent {...props}>{children}</RightContent>;
};
