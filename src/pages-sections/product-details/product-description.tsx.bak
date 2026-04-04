import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Product from "models/Product.model";

const SPEC_KEYWORDS = [
  "Model:", "Color:", "Material:", "Lining:", "Strap:", "Measurements:",
  "Made in", "Season:", "Dimension:", "Composition:", "Condition:", "Detachable",
  "Logo details", "Closure:", "Pocket:", "Handle:", "Specifications:",
];

function parseDescription(raw: string) {
  const text = raw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  let splitIndex = text.length;
  for (const keyword of SPEC_KEYWORDS) {
    const idx = text.indexOf(keyword);
    if (idx !== -1 && idx < splitIndex) splitIndex = idx;
  }
  const intro = text.slice(0, splitIndex).trim();
  const specsRaw = text.slice(splitIndex).trim();
  const specs: string[] = [];
  if (specsRaw) {
    const regex = new RegExp(
      `(?=${SPEC_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "g"
    );
    specs.push(...specsRaw.split(regex).map(s => s.trim()).filter(Boolean));
  }
  return { intro, specs };
}

export default function ProductDescription({ product }: { product: Product }) {
  if (!product.description) return null;
  const { intro, specs } = parseDescription(product.description);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2.5 }}>Description</Typography>
      {intro && (
        <Typography variant="body1" sx={{ mb: 3, color: "text.primary" }}>
          {intro}
        </Typography>
      )}
      {specs.length > 0 && (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
          {specs.map((spec, i) => (
            <Box component="li" key={i} sx={{ py: "10px", borderBottom: i < specs.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.9 }}>{spec}</Typography>
            </Box>
          ))}
        </Box>
      )}
      {!intro && specs.length === 0 && (
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
    </Box>
  );
}
