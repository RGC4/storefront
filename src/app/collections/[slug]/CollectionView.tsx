"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import BackButton from "components/BackButton";

interface Product {
  id: string;
  slug: string;
  title: string;
  vendor: string;
  price: number;
  comparePrice: number;
  discount: number;
  thumbnail: string;
  tags: string[];
  availableForSale: boolean;
  description?: string;
}

interface Props {
  title: string;
  description?: string;
  products: Product[];
}

const PAGE_SIZE = 24;

function extractTagValues(products: Product[], prefix: string): string[] {
  const set = new Set<string>();
  products.forEach(p =>
    p.tags.forEach(tag => {
      const match = tag.match(new RegExp(`^${prefix}:\\s*(.+)$`, "i"));
      if (match) set.add(match[1].trim());
    })
  );
  return Array.from(set).sort();
}

function extractVendors(products: Product[]): string[] {
  return Array.from(new Set(products.map(p => p.vendor).filter(Boolean))).sort();
}

function getDescriptionSnippet(raw?: string): string {
  if (!raw) return "";
  const plain = raw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return plain.length > 120 ? plain.slice(0, 120).trimEnd() + "..." : plain;
}

const filterLabelSx = {
  fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const,
  letterSpacing: "0.08em", color: "grey.500", mb: 0.5,
};

const dropdownSx = {
  bgcolor: "white", minWidth: 280,
  "& .MuiSelect-select": { fontSize: 15, py: "10px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
};

const CLOUDINARY_CLOUD = "dsinnp3ih";
function optimizeImage(url: string, width = 800, height = 800) {
  if (!url) return "";
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/e_trim:10,c_pad,w_${width},h_${height},b_white,f_auto,q_auto/${encodeURI(url)}`;
}

export default function CollectionView({ title, description, products }: Props) {
  const [designers, setDesigners] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const [page, setPage] = useState(1);

  const allDesigners = useMemo(() => extractVendors(products), [products]);
  const colors = useMemo(() => extractTagValues(products, "Color"), [products]);

  const filtered = useMemo(() => products.filter(p => {
    if (designers.length > 0 && !designers.includes(p.vendor)) return false;
    if (color && !p.tags.some(t => t.toLowerCase() === `color: ${color.toLowerCase()}`)) return false;
    return true;
  }).sort((a, b) => {
    const v = a.vendor.localeCompare(b.vendor);
    return v !== 0 ? v : a.title.localeCompare(b.title);
  }), [products, designers, color]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() { setDesigners([]); setColor(""); setPage(1); }
  const hasFilters = designers.length > 0 || !!color;

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", maxWidth: "100vw", overflowX: "hidden" }}>

      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #eee", pt: 4, pb: 3, px: { xs: 2, md: 5 } }}>
        <BackButton />
        <Typography variant="h2" sx={{ mt: 1, mb: 0.5 }}>{title}</Typography>
        {description && (
          <Typography variant="body1" sx={{ color: "grey.500", mb: 2 }}>{description}</Typography>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-end", mt: 2 }}>
          <Box sx={{ maxWidth: "100%" }}>
            <Typography sx={filterLabelSx}>Designer</Typography>
            <Select multiple displayEmpty value={designers}
              onChange={e => { setDesigners(typeof e.target.value === "string" ? [e.target.value] : e.target.value as string[]); setPage(1); }}
              renderValue={(selected) => selected.length === 0
                ? <span style={{ color: "#aaa", fontSize: 15 }}>All Designers</span>
                : <span style={{ fontSize: 15 }}>{selected.length === 1 ? selected[0] : `${selected.length} designers`}</span>}
              sx={{ ...dropdownSx, minWidth: { xs: "100%", sm: 280 }, maxWidth: "100%" }}>
              {allDesigners.map(d => (
                <MenuItem key={d} value={d} sx={{ fontSize: 15, py: 0.75 }}>
                  <Checkbox checked={designers.includes(d)} size="small" sx={{ py: 0.5 }} />
                  <ListItemText primary={d} primaryTypographyProps={{ fontSize: 15 }} />
                </MenuItem>
              ))}
            </Select>
          </Box>

          {colors.length > 0 && (
            <Box>
              <Typography sx={filterLabelSx}>Color</Typography>
              <Select displayEmpty value={color} onChange={e => { setColor(e.target.value); setPage(1); }} sx={dropdownSx}>
                <MenuItem value=""><span style={{ color: "#aaa", fontSize: 15 }}>All Colors</span></MenuItem>
                {colors.map(c => <MenuItem key={c} value={c} sx={{ fontSize: 15 }}>{c}</MenuItem>)}
              </Select>
            </Box>
          )}

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
            {designers.map(d => (
              <Chip key={d} label={d} size="small"
                onDelete={() => { setDesigners(prev => prev.filter(x => x !== d)); setPage(1); }}
                sx={{ fontSize: 12, bgcolor: "#111", color: "white", "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.6)" } }} />
            ))}
            {color && (
              <Chip label={color} size="small" onDelete={() => { setColor(""); setPage(1); }}
                sx={{ fontSize: 12, bgcolor: "#111", color: "white", "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.6)" } }} />
            )}
            {hasFilters && (
              <Typography onClick={resetFilters}
                sx={{ fontSize: 13, color: "#c41230", fontWeight: 700, textDecoration: "underline", cursor: "pointer", ml: 1 }}>
                Clear filters
              </Typography>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: "grey.400", ml: "auto", alignSelf: "center" }}>
            {filtered.length} of {products.length} products
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 5 }, py: 5 }}>
        {paginated.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="body1" sx={{ color: "grey.500" }}>No products match your filters.</Typography>
            <Typography onClick={resetFilters} sx={{ fontSize: 13, color: "#111", textDecoration: "underline", cursor: "pointer", mt: 1 }}>Clear filters</Typography>
          </Box>
        ) : (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
            gap: { xs: "12px", md: 3 },
            alignItems: "stretch",
            width: "100%",
          }}>
            {paginated.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} style={{ textDecoration: "none", color: "inherit", display: "flex", minWidth: 0 }}>
                <Box sx={{
                  width: "100%", minWidth: 0, bgcolor: "white", border: "1px solid #e8e8e8",
                  display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer",
                  transition: "all 0.2s ease", opacity: product.availableForSale ? 1 : 0.6,
                  "&:hover": { borderColor: "#aaa", boxShadow: "0 6px 24px rgba(0,0,0,0.09)", transform: "translateY(-2px)" },
                }}>
                  <Box sx={{
                    px: { xs: "6px", md: 2 },
                    pt: { xs: "8px", md: "18px" },
                    pb: { xs: "8px", md: "14px" },
                    borderBottom: "1px solid #f0f0f0",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: { xs: 56, md: 90 },
                  }}>
                    {product.vendor && (
                      <Typography sx={{
                        fontSize: { xs: 11, md: 18 },
                        fontWeight: 700,
                        color: "#111",
                        textTransform: "uppercase",
                        letterSpacing: { xs: "0.05em", md: "0.08em" },
                        display: "block",
                        mb: { xs: "2px", md: "4px" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                      }}>{product.vendor}</Typography>
                    )}
                    <Typography sx={{
                      fontSize: { xs: 10, md: 13 },
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: "#666",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      textAlign: "center",
                      maxWidth: "100%",
                    }}>
                      {product.title}
                    </Typography>
                  </Box>

                  <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", bgcolor: "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: "6px", md: 2 } }}>
                    {product.thumbnail && (
                      <img src={optimizeImage(product.thumbnail)} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }} />
                    )}
                    {!product.availableForSale && (
                      <Box sx={{ position: "absolute", top: { xs: 4, md: 10 }, right: { xs: 4, md: 10 }, bgcolor: "#888", color: "white", px: { xs: "6px", md: "10px" }, py: { xs: "2px", md: "4px" }, fontSize: { xs: 9, md: 11 }, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Out of Stock</Box>
                    )}
                    {product.availableForSale && product.discount > 0 && (
                      <Box sx={{ position: "absolute", top: { xs: 4, md: 10 }, left: { xs: 4, md: 10 }, bgcolor: "#c41230", color: "white", px: { xs: "6px", md: "12px" }, py: { xs: "2px", md: "5px" }, fontSize: { xs: 9, md: 12 }, fontWeight: 800, letterSpacing: "0.05em" }}>{product.discount}% OFF</Box>
                    )}
                  </Box>

                  <Box sx={{ px: { xs: "8px", md: 2 }, pt: { xs: "8px", md: "10px" }, pb: { xs: "10px", md: "14px" }, borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", flexGrow: 1, mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 0.5, md: 1 }, flexWrap: "wrap" }}>
                      {product.comparePrice > product.price && (
                        <Typography sx={{ fontSize: { xs: 11, md: 13 }, color: "#999", textDecoration: "line-through" }}>${product.comparePrice.toFixed(2)}</Typography>
                      )}
                      <Typography sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 800, color: "#111" }}>${product.price.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ mt: { xs: 1, md: 1.5 }, py: { xs: 1, md: 1.5 }, textAlign: "center", fontSize: { xs: 10, md: 12 }, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", bgcolor: product.availableForSale ? "#111" : "#aaa", color: "white" }}>
                      {product.availableForSale ? "Shop Now" : "Out of Stock"}
                    </Box>
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 6, flexWrap: "wrap" }}>
            <Box onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              sx={{ px: 3, py: 1, border: "1px solid #ddd", cursor: page === 1 ? "default" : "pointer", fontSize: 13, fontWeight: 600, color: page === 1 ? "#ccc" : "#111", bgcolor: "white", userSelect: "none" }}>Prev</Box>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce((acc: (number | string)[], n, i, arr) => {
                if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(n); return acc;
              }, [])
              .map((n, i) => n === "..." ? (
                <Typography key={`e${i}`} variant="caption" sx={{ px: 1, color: "#aaa" }}>...</Typography>
              ) : (
                <Box key={n} onClick={() => { setPage(n as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  sx={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid", borderColor: page === n ? "#111" : "#ddd", bgcolor: page === n ? "#111" : "white", color: page === n ? "white" : "#111", fontSize: 13, fontWeight: 600, cursor: "pointer", userSelect: "none" }}>{n}</Box>
              ))}
            <Box onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              sx={{ px: 3, py: 1, border: "1px solid #ddd", cursor: page === totalPages ? "default" : "pointer", fontSize: 13, fontWeight: 600, color: page === totalPages ? "#ccc" : "#111", bgcolor: "white", userSelect: "none" }}>Next</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}