"use client";

import type { SvgIconProps } from "@mui/material/SvgIcon";
// CUSTOM ICON COMPONENTS
import appIcons from "icons";

  icon: string;
}

type Keys = keyof typeof appIcons;
  if (!icon) return null;

  const Icon = appIcons[icon as Keys];
  return Icon ? <Icon {...props} /> : null;
}
