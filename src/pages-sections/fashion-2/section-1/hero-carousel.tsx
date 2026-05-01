// ✅ GOLDEN — DO NOT MODIFY without testing locally first.
// Last confirmed working: 2026-05-01
// Fixed: SSR flicker, useMediaQuery hydration flash, video remount black flash,
//        first-paint container blowup.
// Key rules: NO useMediaQuery, NO isMounted, NO key={current} on videos.
// CSS lives in src/app/layout.tsx <head> so it's guaranteed before first paint.
"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";
const MOBILE_SLIDE_DURATION = 5000;
const FADE_DURATION = 600;

const SLIDES = [
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-1.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-1-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-1.jpg`,
    headline: process.env.NEXT_PUBLIC_HERO_TITLE_1 || "",
    subheadline: process.env.NEXT_PUBLIC_HERO_SUBTITLE_1 || "",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-2.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-2-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-2.jpg`,
    headline: process.env.NEXT_PUBLIC_HERO_TITLE_2 || "",
    subheadline: process.env.NEXT_PUBLIC_HERO_SUBTITLE_2 || "",
  },
  {
    src: `/assets/stores/${STORE_ID}/videos/hero-3.mp4`,
    posterMobile: `/assets/stores/${STORE_ID}/images/hero-3-mobile.jpg`,
    posterDesktop: `/assets/stores/${STORE_ID}/images/hero-3.jpg`,
    headline: process.env.NEXT_PUBLIC_HERO_TITLE_3 || "",
    subheadline: process.env.NEXT_PUBLIC_HERO_SUBTITLE_3 || "",
  },
];

function HeroText({
  headline,
  subheadline,
  tagline,
}: {
  headline: string;
  subheadline: string;
  tagline: string;
}) {
  return (
    <>
      <Box sx={{
        position: "absolute",
        top: { xs: "7%", md: "10%" },
        left: 0, right: 0,
        px: { xs: 3, sm: 6, md: 8 },
        zIndex: 3,
        pointerEvents: "none",
      }}>
        <Typography sx={{
          color: "rgba(255,255,255,0.82)",
          fontWeight: 400,
          fontSize: { xs: "0.75rem", sm: "1.21rem", md: "1.32rem" },
          letterSpacing: { xs: "0.20em", md: "0.22em" },
          textTransform: "uppercase",
          textShadow: "0 1px 8px rgba(0,0,0,0.7)",
          lineHeight: 1,
        }}>
          {tagline}
        </Typography>
      </Box>

      <Box sx={{
        position: "absolute",
        bottom: { xs: "9%", md: "12%" },
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        px: { xs: 3, sm: 6, md: 8 },
        zIndex: 3,
        pointerEvents: "none",
      }}>
        <Typography sx={{
          color: "white",
          fontWeight: 700,
          mb: { xs: 0.75, md: 1 },
          fontSize: { xs: "1.5rem", sm: "1.95rem", md: "2.40rem" },
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
          lineHeight: { xs: 1.15, md: 1.2 },
          maxWidth: { xs: "85vw", md: "60vw" },
        }}>
          {headline}
        </Typography>
        <Typography sx={{
          color: "rgba(255,255,255,0.95)",
          fontWeight: 400,
          fontSize: { xs: "0.95rem", sm: "1.28rem", md: "1.43rem" },
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          lineHeight: { xs: 1.35, md: 1.4 },
          maxWidth: { xs: "85vw", md: "none" },
        }}>
          {subheadline}
        </Typography>
      </Box>
    </>
  );
}

export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const tagline = process.env.NEXT_PUBLIC_HERO_TAGLINE || "";
  const slide = SLIDES[current];

  // Desktop: play current video, pause others
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [current]);

  // Mobile: timer drives the carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, MOBILE_SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const overlay: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.30)",
    zIndex: 2,
    pointerEvents: "none",
  };

  return (
    <>
      {/* ── MOBILE ── hidden on desktop via layout.tsx CSS */}
      <div
        className="hero-mobile"
        style={{
          position: "relative",
          width: "100%",
          // Hard-clamp: nothing can escape this box
          overflow: "hidden",
          backgroundColor: "#111",
          // Establish the height via aspect-ratio on the wrapper,
          // not relying on children to set it
          aspectRatio: "4 / 5",
        }}
      >
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.posterMobile}
            alt={i === 0 ? s.headline : ""}
            className="hero-slide"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              opacity: current === i ? 1 : 0,
            }}
          />
        ))}
        <div style={overlay} />
        <HeroText headline={slide.headline} subheadline={slide.subheadline} tagline={tagline} />
      </div>

      {/* ── DESKTOP ── hidden on mobile via layout.tsx CSS */}
      <div
        className="hero-desktop"
        style={{
          position: "relative",
          width: "100%",
          // Hard-clamp: nothing inside can affect this height
          height: "90vh",
          maxHeight: "90vh",
          overflow: "hidden",
          backgroundColor: "#111",
        }}
      >
        {SLIDES.map((s, i) => (
          <video
            key={i}
            ref={(el) => { videoRefs.current[i] = el; }}
            onEnded={i === current ? handleVideoEnd : undefined}
            muted
            playsInline
            poster={s.posterDesktop}
            className="hero-slide"
            style={{
              // Absolutely positioned so it NEVER contributes to layout flow
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              // Fill the container, never overflow it
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
          >
            <source src={s.src} type="video/mp4" />
          </video>
        ))}
        <div style={overlay} />
        <HeroText headline={slide.headline} subheadline={slide.subheadline} tagline={tagline} />
      </div>
    </>
  );
}
