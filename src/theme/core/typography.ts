import { geist } from "app/layout";
import type { Typography } from "theme/types";

export const fontSize = 14;

const fw600 = 600;
const fw500 = 500;

export const typography: Typography = {
  fontSize,
  htmlFontSize: 16,
  fontFamily: geist.style.fontFamily,
  body1: { fontSize },
  body2: { fontSize },
  h1: { fontSize: 54, fontWeight: fw600, lineHeight: 1.1 }, // large hero/section headings
  h2: { fontSize: 38, fontWeight: fw600, lineHeight: 1.2 }, // page-level headings
  h3: { fontSize: 28, fontWeight: fw600, lineHeight: 1.3 },
  h4: { fontSize: 20, fontWeight: fw500 },
  h5: { fontSize: 16, fontWeight: fw500, lineHeight: 1 },
  h6: { fontSize, fontWeight: fw500 },
  subtitle1: { fontSize: 16, fontWeight: fw500 },
  subtitle2: { fontSize: 14, fontWeight: fw500 },
};
