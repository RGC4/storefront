"use client";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
<<<<<<< HEAD
=======
// CONSTANT VARIABLES
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { layoutConstant } from "utils/constants";

export const HeaderWrapper = styled("div")(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
<<<<<<< HEAD
  transition: "height 250ms ease-in-out, background-color 300ms ease",
  background: theme.palette.background.paper,
  // When data-transparent="true", go fully transparent
  '&[data-transparent="true"]': {
    background: "transparent",
    boxShadow: "none",
  },
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
=======
  transition: "height 250ms ease-in-out",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight
  }
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
}));

export const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  "& > div": {
    gap: 2,
    height: "100%",
    display: "flex",
    alignItems: "center",
<<<<<<< HEAD
    justifyContent: "space-between",
=======
    justifyContent: "space-between"
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  },
  "& .mobile-header": { display: "none" },
  [theme.breakpoints.down(1150)]: {
    "& .mobile-header": { display: "flex" },
<<<<<<< HEAD
    "& .main-header": { display: "none" },
  },
=======
    "& .main-header": { display: "none" }
  }
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
}));
