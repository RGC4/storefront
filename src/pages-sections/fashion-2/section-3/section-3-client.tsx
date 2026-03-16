"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

function CategoryTile({ cat }: { cat: Category }) {
  return (
    <Link href={`/collections/${cat.slug}`}
      style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <Box sx={{
        position: "relative",
        height: { xs: 280, sm: 380, md: 480 },
        overflow: "hidden",
        bgcolor: "grey.200",
        "&:hover .img": { transform: "scale(1.04)" },
      }}>
        <Box className="img" component="img"
          src={cat.image}
          alt={cat.name}
          sx={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transition: "transform 0.45s ease",
          }}
        />
        <Box sx={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          p: { xs: 2, md: 4 },
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}>
          <Typography sx={{
            color: "white",
            fontSize: { xs: 20, md: 28 },
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            lineHeight: 1.2,
            mb: 0.5,
          }}>
            {cat.name}
          </Typography>
          <Typography sx={{
            color: "rgba(255,255,255,0.95)",
            fontSize: { xs: 12, md: 14 },
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}>
            Shop Now
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

export default function Section3Client({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) return null;

  const useCarousel = categories.length > 5;
  const tileWidth = 380; // px per tile in carousel mode

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -tileWidth : tileWidth,
      behavior: "smooth",
    });
  };

  // GRID MODE — 5 or fewer categories
  if (!useCarousel) {
    return (
      <Box sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          md: `repeat(${categories.length}, 1fr)`,
        },
        gap: 0,
      }}>
        {categories.map((cat) => (
          <CategoryTile key={cat.id} cat={cat} />
        ))}
      </Box>
    );
  }

  // CAROUSEL MODE — more than 5 categories
  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>

      {/* LEFT ARROW */}
      <IconButton onClick={() => scroll("left")} sx={{
        position: "absolute", left: 8, top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        bgcolor: "rgba(255,255,255,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        "&:hover": { bgcolor: "white" },
      }}>
        <ArrowBackIos sx={{ fontSize: 18, ml: 0.5 }} />
      </IconButton>

      {/* SCROLLABLE TRACK */}
      <Box ref={scrollRef} sx={{
        display: "flex",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}>
        {categories.map((cat) => (
          <Box key={cat.id} sx={{
            width: { xs: "50vw", md: `${tileWidth}px` },
            flexShrink: 0,
            scrollSnapAlign: "start",
          }}>
            <CategoryTile cat={cat} />
          </Box>
        ))}
      </Box>

      {/* RIGHT ARROW */}
      <IconButton onClick={() => scroll("right")} sx={{
        position: "absolute", right: 8, top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        bgcolor: "rgba(255,255,255,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        "&:hover": { bgcolor: "white" },
      }}>
        <ArrowForwardIos sx={{ fontSize: 18 }} />
      </IconButton>

    </Box>
  );
}
