import { list } from "@vercel/blob";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

(async () => {
  const r = await list({ prefix: "stores/s1/" });
  if (r.blobs.length === 0) {
    console.log("No blobs found under stores/s1/");
    return;
  }
  console.log(r.blobs.map(b => `${b.pathname}  (${b.size} bytes)  ${b.url}`).join("\n"));
})();
