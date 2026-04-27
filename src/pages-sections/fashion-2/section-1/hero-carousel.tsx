"use client";

import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

// =============================================================================
// All store-specific content lives in Vercel environment variables.
// Each store (s1, s2, ...) is a separate Vercel project with its own values.
// Locally, run `vercel env pull .env.local` to sync the active store's vars.
//
// Required env vars per store:
//   NEXT_PUBLIC_STORE_ID         e.g. "s1"
//   NEXT_PUBLIC_HERO_TAGLINE     small uppercase line above the headline
//   NEXT_PUBLIC_HERO_TITLE_1     headline for slide 1
//   NEXT_PUBLIC_HERO_TITLE_2     headline for slide 2
//   NEXT_PUBLIC_HERO_TITLE_3     headline for slide 3
//   NEXT_PUBLIC_HERO_SUBTITLE_1  subheadline for slide 1
//   NEXT_PUBLIC_HERO_SUBTITLE_2  subheadline for slide 2
//   NEXT_PUBLIC_HERO_SUBTITLE_3  subheadline for slide 3
//
// Asset paths use STORE_ID, so each store serves its own videos/images from
// /assets/stores/{STORE_ID}/...
// =============================================================================

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "s1";

// How long each mobile slide stays on screen before advancing (ms)
const MOBILE_SLIDE_DURATION = 5000;

// Build the slides array from env vars. If a title or subtitle is missing,
// the slide still renders but with empty text - it never falls back to a
// hardcoded marketing string from another store.
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

// =============================================================================
// HeroText - rendered as a separate component so React can update its content
// without remounting it. Sits as a sibling of the keyed <video>, not inside
// its render tree, so when the video unmounts/remounts on slide change, this
// component just gets new props - no flash, no flicker.
// =============================================================================
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
      {/* Top tagline (the small uppercase line) */}
      <Box sx={{
        position: "absolute",
        top: { xs: "7%", md: "10%" },
        left: 0, right: 0,
        px: { xs: 3, sm: 6, md: 8 },
        zIndex: 2,
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

      {/* Bottom headline + subheadline */}
      <Box sx={{
        position: "absolute",
        bottom: { xs: "9%", md: "12%" },
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        px: { xs: 3, sm: 6, md: 8 },
        zIndex: 2,
        pointerEvents: "none",
      }}>
        <Typography sx={{
          color: "white",
          fontWeight: 700,
          mb: { xs: 0.75, md: 1 },
          whiteSpace: "normal",
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

// =============================================================================
// VideoHero - the carousel itself.
// =============================================================================
export default function VideoHero() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const tagline = process.env.NEXT_PUBLIC_HERO_TAGLINE || "";

  // Desktop: video drives the carousel via onEnded.
  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [current, isMobile]);

  // Mobile: timer drives the carousel since there is no video.
  useEffect(() => {
    if (!isMobile) return;
    const advance = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, MOBILE_SLIDE_DURATION);
    return () => clearTimeout(advance);
  }, [current, isMobile]);

  const handleVideoEnd = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  const overlayStyle = {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    zIndex: 1,
  };

  // -- MOBILE --------------------------------------------------
  if (isMobile) {
    const nextIndex = (current + 1) % SLIDES.length;
    return (
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        backgroundColor: "#111",
      }}>
        <img
          src={slide.posterMobile}
          alt={slide.headline}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Preload next slide so swap is instant */}
        <img
          src={SLIDES[nextIndex].posterMobile}
          alt=""
          aria-hidden="true"
          style={{ display: "none" }}
        />
        <div style={overlayStyle} />
        <HeroText
          headline={slide.headline}
          subheadline={slide.subheadline}
          tagline={tagline}
        />
      </div>
    );
  }

  // -- DESKTOP -------------------------------------------------
  // key={current} forces React to mount a fresh <video> per slide,
  // killing the "zoomed in then snaps back" bug. The poster fills the
  // ~200ms loading gap. <HeroText> sits OUTSIDE the keyed video so it
  // doesn't remount on slide change - just its props update.
  const desktopContainerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "90vh",
    overflow: "hidden",
    backgroundColor: "#111",
  };

  const desktopVideoStyle = {
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

  return (
    <div style={desktopContainerStyle}>
      <video
        key={current}
        ref={videoRef}
        onEnded={handleVideoEnd}
        muted
        playsInline
        autoPlay
        poster={slide.posterDesktop}
        style={desktopVideoStyle}
      >
        <source src={slide.src} type="video/mp4" />
      </video>
      <div style={overlayStyle} />
      <HeroText
        headline={slide.headline}
        subheadline={slide.subheadline}
        tagline={tagline}
      />
    </div>
  );
}
