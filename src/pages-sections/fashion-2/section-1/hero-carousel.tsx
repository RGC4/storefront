"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-1.jpg`,
    headline: "Moments That Deserve to Be Noticed.",
    subheadline: "Luxury That Belongs in the Spotlight.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-2.jpg`,
    headline: "Friends. Laughter. Timeless Style.",
    subheadline: "Unforgettable moments.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    poster: `/assets/stores/${STORE_ID}/images/hero-3.jpg`,
    headline: "Genuine Italian Leather. Exceptional Craftsmanship.",
    subheadline: "Exceptional service on every order, every time.",
  },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;
    setTextVisible(false);
    setTimeout(() => setTextVisible(true), 300);
    video.load();
    video.play().catch(() => {});
  }, [current, isMobile]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  const tagline = (
    <Box sx={{
      position: "absolute",
      top: { xs: "8%", md: "10%" },
      left: 0,
      px: { xs: 3, sm: 6, md: 8 },
    }}>
      <Typography sx={{
        color: "rgba(255,255,255,0.82)",
        fontWeight: 400,
        fontSize: { xs: "1.16rem", sm: "1.21rem", md: "1.32rem" },
        letterSpacing: { xs: "0.18em", md: "0.22em" },
        textTransform: "uppercase",
        textShadow: "0 1px 8px rgba(0,0,0,0.7)",
        lineHeight: 1,
      }}>
        {process.env.NEXT_PUBLIC_HERO_TAGLINE || ""}
      </Typography>
    </Box>
  );

  const textOverlay = (
    <Box sx={{
      position: "absolute",
      bottom: { xs: "10%", md: "12%" },
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      px: { xs: 3, sm: 6, md: 8 },
      opacity: textVisible ? 1 : 0,
      transition: "opacity 600ms ease",
    }}>
      <Typography sx={{
        color: "white",
        fontWeight: 700,
        mb: 1,
        whiteSpace: "normal",
        fontSize: { xs: "1.65rem", sm: "1.95rem", md: "2.40rem" },
        textShadow: "0 2px 12px rgba(0,0,0,0.7)",
        lineHeight: 1.2,
        maxWidth: { xs: "90vw", md: "60vw" },
      }}>
        {slide.headline}
      </Typography>
      <Typography sx={{
        color: "rgba(255,255,255,0.95)",
        fontWeight: 400,
        fontSize: { xs: "1.20rem", sm: "1.28rem", md: "1.43rem" },
        textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        maxWidth: { xs: "90vw", md: "none" },
      }}>
        {slide.subheadline}
      </Typography>
    </Box>
  );

  // At 1920px wide, 40vw = 768px. At 90% zoom that shows nicely with purses below.
  const containerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "90vh",
    overflow: "hidden",
    backgroundColor: "#111",
  };

  const overlayStyle = {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.30)",
  };

  const mediaStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "90vh",
    objectFit: "cover" as const,
    objectPosition: "center 20%",
  };

  if (isMobile) {
    return (
      <div style={containerStyle}>
        <img src={slide.poster} alt={slide.headline} style={mediaStyle} />
        <div style={overlayStyle} />
        {tagline}
        {textOverlay}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <video ref={videoRef} onEnded={handleVideoEnd} muted playsInline autoPlay style={mediaStyle}>
        <source src={slide.src} type="video/mp4" />
      </video>
      <div style={overlayStyle} />
      {tagline}
      {textOverlay}
    </div>
  );
}
