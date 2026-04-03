import { geist } from "app/layout";
import type { Typography } from "theme/types";

export const fontSize = 15;

const fw400 = 400;
const fw500 = 500;
const fw600 = 600;
const fw700 = 700;

export const typography: Typography = {
  fontSize,
  htmlFontSize: 16,
  fontFamily: geist.style.fontFamily,
  h1: { fontSize: 48, fontWeight: fw700, lineHeight: 1.1 },
  h2: { fontSize: 36, fontWeight: fw700, lineHeight: 1.2 },
  h3: { fontSize: 28, fontWeight: fw600, lineHeight: 1.3 },
  h4: { fontSize: 22, fontWeight: fw600, lineHeight: 1.4 },
  h5: { fontSize: 18, fontWeight: fw600, lineHeight: 1.4 },
  h6: { fontSize: 16, fontWeight: fw600, lineHeight: 1.4 },
  body1: { fontSize: 15, fontWeight: fw400, lineHeight: 1.7 },
  body2: { fontSize: 13, fontWeight: fw400, lineHeight: 1.6 },
  subtitle1: { fontSize: 13, fontWeight: fw500, lineHeight: 1.4 },
  subtitle2: { fontSize: 12, fontWeight: fw400, lineHeight: 1.4 },
  overline: {
    fontSize: 12,
    fontWeight: fw600,
    lineHeight: 1.5,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  caption: { fontSize: 11, fontWeight: fw400, lineHeight: 1.5 },
};
