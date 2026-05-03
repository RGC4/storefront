// src/pages-sections/fashion-2/section-1/hero-carousel.tsx
//
// FRAMING-FIX VERSION  (2026-05-02)
// ---------------------------------------------------------------
// Keeps the SSR / hydration / first-paint protections from the
// previous "GOLDEN" file (no useMediaQuery, hero hidden until
// React hydrates and video is ready, mobile/desktop split via
// CSS classes defined in src/app/layout.tsx).
//
// Restores the ORIGINAL desktop video sizing trick that was lost:
//
//   width: auto;
//   height: 90vh;
//   min-width: 100%;
//   min-height: 100%;
//   transform: translate(-50%, -50%);
//
// This lets the MP4 keep its native aspect ratio while filling
// a 90vh container, instead of being upscaled+cropped to a face.
//
// Mobile poster framing centered (no longer biased to "center 20%")
// since the mobile JPGs are already composed for 4:5.
// ---------------------------------------------------------------
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

// Fully fills its parent — used for layered slide containers and the
// dim overlay, NOT for the actual video element (see desktopMediaStyle).
const fillAbsolute: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

// Centered, aspect-preserving full-bleed style for the desktop video
// and its matching poster image. Native AR is preserved: the media
// is sized so it covers the 90vh box without being upscaled past
// the point where 16:9 source content gets cropped to a face.
const desktopMediaStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  height: "90vh",
  minWidth: "100%",
  minHeight: "100%",
  objectFit: "cover",
  objectPosition: "center center",
};

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
        zIndex: 4,
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
        zIndex: 4,
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
  const [ready, setReady] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const tagline = process.env.NEXT_PUBLIC_HERO_TAGLINE || "";
  const slide = SLIDES[current];

  // On mount: start video 0, then reveal the hero.
  useEffect(() => {
    const vid = videoRefs.current[0];
    if (!vid) {
      setReady(true);
      return;
    }

    const reveal = () => setReady(true);
    vid.addEventListener("canplay", reveal, { once: true });
    vid.play().catch(() => {});

    // Fallback: reveal after 800ms even if canplay never fires
    const fallback = setTimeout(() => setReady(true), 800);

    return () => {
      vid.removeEventListener("canplay", reveal);
      clearTimeout(fallback);
    };
  }, []);

  // Desktop: play current video, pause others
  useEffect(() => {
    if (!ready) return;
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [current, ready]);

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
    ...fillAbsolute,
    backgroundColor: "rgba(0,0,0,0.30)",
    zIndex: 3,
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        width: "100%",
      }}
    >
      {/* ── MOBILE ── hidden on desktop via layout.tsx CSS */}
      <div
        className="hero-mobile"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          overflow: "hidden",
          backgroundColor: "#111",
        }}
      >
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.posterMobile}
            alt={i === 0 ? s.headline : ""}
            className="hero-slide"
            style={{
              ...fillAbsolute,
              objectFit: "cover",
              objectPosition: "center center",
              opacity: current === i ? 1 : 0,
              zIndex: 1,
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
          height: "90vh",
          overflow: "hidden",
          backgroundColor: "#111",
        }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="hero-slide"
            style={{
              ...fillAbsolute,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 2 : 1,
            }}
          >
            {/* Poster image — same sizing trick as the video so the
                first paint matches the video's framing exactly. */}
            <img
              src={s.posterDesktop}
              alt=""
              aria-hidden="true"
              style={{ ...desktopMediaStyle, zIndex: 0 }}
            />
            {/* Video — width:auto, height:90vh, min-w/h:100%, centered.
                Native aspect ratio preserved; no face-zoom. */}
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              onEnded={i === current ? handleVideoEnd : undefined}
              muted
              playsInline
              style={{ ...desktopMediaStyle, zIndex: 1 }}
            >
              <source src={s.src} type="video/mp4" />
            </video>
          </div>
        ))}
        <div style={overlay} />
        <HeroText headline={slide.headline} subheadline={slide.subheadline} tagline={tagline} />
      </div>
    </div>
  );
}
