"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    headline: "Authentic Italian - designer purses and handbags.",
    subheadline: "Luxury that bBelongs in the spotlight.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    headline: "Style that turns moments with friends into lasting memories.",
    subheadline: "Unforgetable moments are priceless.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    headline: "Genuine Italian Leather. Exceptional Craftsmanship.",
    subheadline: "Exceptional service on every order, every time.",
  },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setTextVisible(false);
    setTimeout(() => setTextVisible(true), 300);
    video.load();
    video.play().catch(() => {});
  }, [current]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(400px, 56.25vw, 1080px)",
      overflow: "hidden",
      backgroundColor: "#111",
    }}>
      {/* VIDEO */}
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        muted
        playsInline
        autoPlay
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover",
          objectPosition: "center 30%",
        }}
      >
        <source src={slide.src} type="video/mp4" />
      </video>

      {/* 20% DARK OVERLAY */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.20)",
      }} />

      {/* TEXT OVERLAY — positioned at 85% from top */}
      <Box sx={{
        position: "absolute",
        top: "85%",
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        px: { xs: 3, sm: 6, md: 12 },
        opacity: textVisible ? 1 : 0,
        transition: "opacity 600ms ease",
      }}>
        <Typography variant="h1" sx={{
          color: "white",
          fontWeight: 700,
          mb: 2,
          whiteSpace: "nowrap",
          fontSize: { xs: "2.4rem", sm: "3rem", md: "4.8rem" },
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          lineHeight: 1.1,
        }}>
          {slide.headline}
        </Typography>
        <Typography sx={{
          color: "rgba(255,255,255,0.92)",
          whiteSpace: "nowrap",
          fontWeight: 400,
          fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.8rem" },
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}>
          {slide.subheadline}
        </Typography>
      </Box>
    </div>
  );
}
