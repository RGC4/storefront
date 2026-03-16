"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    headline: "Authentic Italian Women's Purses & Bags.",
    subheadline: "100% Genuine Italian Leather.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    headline: "Trusted Italian Suppliers with Over a Decade of Experience.",
    subheadline: "100% Guaranteed Authenticity.",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    headline: "Generations of specialized leather craftsmanship.",
    subheadline: "Quality not found in mass-produced alternatives.",
  },
];

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);

  // Mount: wait for first frame before fading text in — eliminates initial blip
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      video.play().catch(() => {});
      setTimeout(() => setTextVisible(true), 100);
    };

    if (video.readyState >= 3) {
      onCanPlay();
    } else {
      video.addEventListener("canplay", onCanPlay, { once: true });
    }

    return () => video.removeEventListener("canplay", onCanPlay);
  }, []);

  // Slide change: fade text out, swap video, fade back in
  useEffect(() => {
    if (current === 0) return;
    const video = videoRef.current;
    if (!video) return;

    setTextVisible(false);

    const onCanPlay = () => {
      video.play().catch(() => {});
      setTimeout(() => setTextVisible(true), 100);
    };

    video.load();
    if (video.readyState >= 3) {
      onCanPlay();
    } else {
      video.addEventListener("canplay", onCanPlay, { once: true });
    }

    return () => video.removeEventListener("canplay", onCanPlay);
  }, [current]);

  // Silently preload next slide
  useEffect(() => {
    const next = (current + 1) % SLIDES.length;
    const preload = preloadRef.current;
    if (!preload) return;
    preload.src = SLIDES[next].src;
    preload.load();
  }, [current]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    /*
     * Key fix for layout shift: explicit `85vh` height with `overflow:hidden`.
     * The height never changes regardless of video state — the video is
     * absolutely positioned inside so it can never push or pull the wrapper.
     */
    <div style={{
      position: "relative",
      width: "100%",
      height: "70vh",
      maxHeight: 1000,
      overflow: "hidden",
      backgroundColor: "#111",
    }}>

      {/* ACTIVE VIDEO — fills container, object-fit centers subject */}
      <video
        ref={videoRef}
        key={slide.src}
        onEnded={handleVideoEnd}
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 35%",
        }}
      >
        <source src={slide.src} type="video/mp4" />
      </video>

      {/* HIDDEN PRELOAD VIDEO for next slide */}
      <video
        ref={preloadRef}
        muted
        playsInline
        preload="auto"
        style={{ display: "none" }}
      />

      {/* DARK OVERLAY */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.20)",
      }} />

      {/* TEXT OVERLAY */}
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
        transition: "opacity 500ms ease",
      }}>
        <Typography variant="h1" sx={{
          color: "white",
          fontWeight: 700,
          mb: 1,
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
