<<<<<<< HEAD
"use client";
=======
﻿"use client";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export type VideoHeroProps = {
  heroVideo: string | null;
  heroImage: string;
  heroPoster: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
};

export default function VideoHero({ heroVideo, heroImage, heroPoster, headline, subheadline, ctaText, ctaLink }: VideoHeroProps) {
  return (
    <Box sx={{ position: "relative", width: "100%", height: { xs: "60vh", md: "85vh" }, overflow: "hidden", bgcolor: "grey.900" }}>
      {heroVideo ? (
<<<<<<< HEAD
        <video autoPlay muted loop playsInline poster={heroPoster} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom center" }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <Box component="img" src={heroImage} alt={headline} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom center" }} />
=======
        <video autoPlay muted loop playsInline poster={heroPoster} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : (
        <Box component="img" src={heroImage} alt={headline} sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      )}
      <Box sx={{ position: "absolute", inset: 0, background: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", px: { xs: 3, sm: 6, md: 12 } }}>
        <Typography variant="h1" sx={{ color: "white", fontWeight: 700, mb: 2, maxWidth: 640, fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" } }}>{headline}</Typography>
        <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.88)", mb: 4, maxWidth: 500, fontWeight: 400 }}>{subheadline}</Typography>
        <Button variant="outlined" href={ctaLink} size="large" sx={{ color: "white", borderColor: "white", borderWidth: 2, px: 5, py: 1.5, fontSize: "1rem", letterSpacing: 1, "&:hover": { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "white" } }}>{ctaText}</Button>
      </Box>
    </Box>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
