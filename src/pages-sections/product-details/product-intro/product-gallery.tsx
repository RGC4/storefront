"use client";

import { useState, useRef, useCallback } from "react";

const VISIBLE_THUMBS = 5;

export default function ProductGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  const mainSrc = (url: string) =>
    url.includes("cdn.shopify.com") ? `${url.split("?")[0]}?width=1400` : url;
  const thumbSrc = (url: string) =>
    url.includes("cdn.shopify.com") ? `${url.split("?")[0]}?width=200` : url;

  const canScrollUp = thumbStart > 0;
  const canScrollDown = thumbStart + VISIBLE_THUMBS < images.length;
  const visibleImages = images.slice(thumbStart, thumbStart + VISIBLE_THUMBS);

  return (
    <div style={{ display: "flex", gap: "12px", width: "100%", height: "clamp(300px, 50vw, 638px)" }}>

      {/* LEFT: Thumbnail strip - wider */}
      <div style={{
        width: "143px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        {canScrollUp && (
          <button onClick={() => setThumbStart(s => Math.max(0, s - 1))}
            style={{ height: "32px", border: "1px solid #ddd", background: "#f8f8f8",
              cursor: "pointer", fontSize: "14px", color: "#555", borderRadius: "4px" }}>{"\u2191"}</button>
        )}

        {visibleImages.map((url, i) => {
          const globalIndex = thumbStart + i;
          const isSelected = current === globalIndex;
          return (
            <div key={globalIndex} onClick={() => setCurrent(globalIndex)}
              style={{
                flex: 1,
                border: isSelected ? "2px solid #111" : "1px solid #ddd",
                borderRadius: "6px",
                cursor: "pointer",
                overflow: "hidden",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <img src={thumbSrc(url)} alt={`view ${globalIndex + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain",
                  objectPosition: "center center", padding: "8px",
                  display: "block", pointerEvents: "none" }} />
            </div>
          );
        })}

        {canScrollDown && (
          <button onClick={() => setThumbStart(s => Math.min(images.length - VISIBLE_THUMBS, s + 1))}
            style={{ height: "32px", border: "1px solid #ddd", background: "#f8f8f8",
              cursor: "pointer", fontSize: "14px", color: "#555", borderRadius: "4px" }}>{"\u2193"}</button>
        )}
      </div>

      {/* RIGHT: Main image - centered both axes */}
      <div ref={mainRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
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
        }}>
        <img ref={imgRef} src={mainSrc(images[current])} alt="product"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            objectPosition: "center center",
            padding: "16px",
            transition: "scale 0.2s ease, translate 0.08s linear",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }} />
      </div>
    </div>
  );
}
