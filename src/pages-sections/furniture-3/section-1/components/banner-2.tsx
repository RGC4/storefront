import { PropsWithChildren } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
// STYLED COMPONENTS
import { StyledWrapper } from "./styles";

  title: string;
  description: string;
}
  return (
    <StyledWrapper>
      <Link href="#">
        {children}

        <div className="text-content">
          <Typography variant="h2" className="title">
            {title}
          </Typography>

          <Typography variant="body1" className="description">
            {description}
          </Typography>
        </div>
      </Link>
    </StyledWrapper>
  );
}
