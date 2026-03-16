import type { ComponentProps } from "react";
import ChevronRight from "icons/ChevronRight";
import { RootContainer } from "./styles";

  open?: boolean;
  showIcon?: boolean;
}
  sx,
  ref,
  children,
  open = false,
  showIcon = true,
  ...others
}: AccordionHeaderProps) {
  return (
    <RootContainer ref={ref} open={open} sx={sx} {...others}>
      {children}
      {showIcon && <ChevronRight className="caret" />}
    </RootContainer>
  );
}
