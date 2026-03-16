import Typography from "@mui/material/Typography";
<<<<<<< HEAD
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
=======

export default function ProductDescription() {
  return (
    <div>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Specification:
      </Typography>

      <div>
        Brand: Beats <br />
        Model: S450 <br />
        Wireless Bluetooth Headset <br />
        FM Frequency Response: 87.5 – 108 MHz <br />
        Feature: FM Radio, Card Supported (Micro SD / TF) <br />
        Made in China <br />
      </div>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
    </div>
  );
}
