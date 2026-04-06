"use client";

import { useState, useRef, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const VISIBLE_THUMBS = 5;

export default function ProductGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    const box = mainRef.current;
    if (!img || !box) return;
    const rect = box.getBoundingClientRect();
    const pctX = (e.clientX - rect.left) / rect.width;
    const pctY = (e.clientY - rect.top) / rect.height;
    img.style.scale = "1.4";
    img.style.translate = `${-(pctX * 40 - 20)}% ${-(pctY * 40 - 20)}%`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    img.style.scale = "1";
    img.style.translate = "0 0";
  }, []);

  if (!images?.length) return null;

  const CLOUDINARY_CLOUD = "dsinnp3ih";
  const cloudinaryUrl = (url: string, w: number, h: number) =>
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/e_trim,c_pad,w_${w},h_${h},b_white,f_auto,q_auto/${encodeURI(url)}`;

  const mainSrc = (url: string) => cloudinaryUrl(url, 1200, 1200);
  const thumbSrc = (url: string) => cloudinaryUrl(url, 200, 200);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(images.length - 1, c + 1));

  // MOBILE
  if (isMobile) {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 340,
            backgroundColor: "white",
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchStart={e => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={e => {
            if (touchStart === null) return;
            const diff = touchStart - e.changedTouches[0].clientX;
            if (diff > 50) next();
            else if (diff < -50) prev();
            setTouchStart(null);
          }}
        >
          <img
            src={mainSrc(images[current])}
            alt="product"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 12 }}
          />
          {current > 0 && (
            <button onClick={prev} style={{
              position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.45)", color: "white", border: "none",
              borderRadius: 6, width: 36, height: 36, fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>&#8249;</button>
          )}
          {current < images.length - 1 && (
            <button onClick={next} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.45)", color: "white", border: "none",
              borderRadius: 6, width: 36, height: 36, fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>&#8250;</button>
          )}
          <div style={{
            position: "absolute", bottom: 8, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 6,
          }}>
            {images.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                width: i === current ? 20 : 8, height: 8, borderRadius: 4,
                backgroundColor: i === current ? "#111" : "#ccc",
                transition: "all 0.2s ease", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>
        <div style={{
          display: "flex", gap: 8, marginTop: 10, overflowX: "auto",
          paddingBottom: 4, scrollbarWidth: "none",
        }}>
          {images.map((url, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{
              flexShrink: 0, width: 56, height: 56,
              border: current === i ? "2px solid #111" : "1px solid #ddd",
              borderRadius: 6, overflow: "hidden", backgroundColor: "white", cursor: "pointer",
            }}>
              <img src={thumbSrc(url)} alt={`view ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // DESKTOP
  const canScrollUp = thumbStart > 0;
  const canScrollDown = thumbStart + VISIBLE_THUMBS < images.length;
  const visibleImages = images.slice(thumbStart, thumbStart + VISIBLE_THUMBS);

  return (
    <div style={{ display: "flex", gap: "12px", width: "100%" }}>

      {/* THUMBNAIL SIDEBAR */}
      <div style={{ width: "100px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {canScrollUp && (
          <button onClick={() => setThumbStart(s => Math.max(0, s - 1))}
            style={{ height: "28px", border: "1px solid #ddd", background: "#f8f8f8", cursor: "pointer", fontSize: "14px", color: "#555", borderRadius: "4px" }}>↑</button>
        )}
        {visibleImages.map((url, i) => {
          const globalIndex = thumbStart + i;
          const isSelected = current === globalIndex;
          return (
            <div key={globalIndex} onClick={() => setCurrent(globalIndex)}
              style={{
                height: "90px",
                border: isSelected ? "2px solid #111" : "1px solid #ddd",
                borderRadius: "6px", cursor: "pointer", overflow: "hidden",
                backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <img src={thumbSrc(url)} alt={`view ${globalIndex + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px", display: "block", pointerEvents: "none" }} />
            </div>
          );
        })}
        {canScrollDown && (
          <button onClick={() => setThumbStart(s => Math.min(images.length - VISIBLE_THUMBS, s + 1))}
            style={{ height: "28px", border: "1px solid #ddd", background: "#f8f8f8", cursor: "pointer", fontSize: "14px", color: "#555", borderRadius: "4px" }}>↓</button>
        )}
      </div>

      {/* MAIN IMAGE — aspect-ratio box so it sizes to the image naturally */}
      <div
        ref={mainRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          flex: 1,
          border: "1px solid #e8e8e8",
          borderRadius: "6px",
          overflow: "hidden",
          cursor: "crosshair",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          maxHeight: "600px",
          aspectRatio: "1 / 1",
        }}
      >
        <img
          ref={imgRef}
          src={mainSrc(images[current])}
          alt="product"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            padding: "20px",
            transition: "scale 0.2s ease, translate 0.08s linear",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
