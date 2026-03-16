import Typography from "@mui/material/Typography";
import Product from "models/Product.model";

function parseDescription(raw: string) {
  const text = raw.replace(/<[^>]+>/g, "").trim();
  const specKeywords = ["Model:","Color:","Material:","Lining:","Strap:","Measurements:",
    "Made in","Season:","Dimension:","Composition:","Condition:","Detachable",
    "Logo details","Closure:","Pocket:","Handle:","Specifications:"];
  let splitIndex = text.length;
  for (const keyword of specKeywords) {
    const idx = text.indexOf(keyword);
    if (idx !== -1 && idx < splitIndex) splitIndex = idx;
  }
  const intro = text.slice(0, splitIndex).trim();
  const specsRaw = text.slice(splitIndex).trim();
  const specs: string[] = [];
  if (specsRaw) {
    const regex = new RegExp(`(?=${specKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")})`, "g");
    specs.push(...specsRaw.split(regex).map((s) => s.trim()).filter(Boolean));
  }
  return { intro, specs };
}

export default function ProductDescription({ product }: { product: Product }) {
  if (!product.description) return null;
  const { intro, specs } = parseDescription(product.description);
  return (
    <div>
      <Typography sx={{ mb: 2.5, fontSize: 26, fontWeight: 700 }}>Description</Typography>
      {intro && (
        <Typography sx={{ mb: 3, fontSize: 20, lineHeight: 2, color: "text.primary" }}>
          {intro}
        </Typography>
      )}
      {specs.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {specs.map((spec, i) => (
            <li key={i} style={{
              fontSize: "19px", lineHeight: 1.9, color: "#333",
              paddingBlock: "10px",
              borderBottom: i < specs.length - 1 ? "1px solid #f0f0f0" : "none",
            }}>
              {spec}
            </li>
          ))}
        </ul>
      )}
      {!intro && specs.length === 0 && (
        <Typography sx={{ fontSize: 20, lineHeight: 2 }}
          dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
    </div>
  );
}
