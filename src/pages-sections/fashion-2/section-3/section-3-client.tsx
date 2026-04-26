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
        height: { xs: 140, sm: 220, md: 360 },
        overflow: "hidden",
        bgcolor: "grey.200",
        border: "1px solid #000",
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
          p: { xs: 1.5, md: 2.5 },
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}>
          {/* Category name: was xs:20 md:28 â€” now xs:14 md:18 */}
          <Typography sx={{
            color: "white",
            fontSize: { xs: 14, md: 18 },
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            lineHeight: 1.2,
            mb: 0.25,
          }}>
            {cat.name}
          </Typography>
          {/* Shop Now label: was xs:12 md:14 â€” now consistent 11px */}
          <Typography sx={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 11,
            fontWeight: 600,
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

  const useCarousel = categories.length > 8;
  const tileWidth = 320;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -tileWidth : tileWidth,
      behavior: "smooth",
    });
  };

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
      borderBottom: "1px solid #000",
      }}>
        {categories.map((cat) => (
          <CategoryTile key={cat.id} cat={cat} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& > *": { scrollSnapAlign: "start", width: tileWidth, flexShrink: 0 },
        }}
      >
        {categories.map((cat) => (
          <CategoryTile key={cat.id} cat={cat} />
        ))}
      </Box>
      <IconButton onClick={() => scroll("left")}
        sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.85)", "&:hover": { bgcolor: "white" }, zIndex: 2 }}>
        <ArrowBackIos fontSize="small" />
      </IconButton>
      <IconButton onClick={() => scroll("right")}
        sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.85)", "&:hover": { bgcolor: "white" }, zIndex: 2 }}>
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
}
