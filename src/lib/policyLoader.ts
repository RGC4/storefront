// src/lib/policyLoader.ts
// Reads policy HTML files from public/assets/stores/{storeId}/policies/
// Extracts structured content for rendering in the site's MUI theme.
// Auto-replaces the brand name found in the HTML with NEXT_PUBLIC_STORE_NAME.

import { readFileSync } from "fs";
import { join } from "path";

export interface PolicySection {
  title: string;
  /** HTML string for the section body (paragraphs, lists, etc.) */
  body: string;
}

export interface PolicyData {
  pageTitle: string;
  intro: string;
  sections: PolicySection[];
  footer: string;
}

/**
 * Load and parse a policy HTML file for the current store.
 * @param filename - e.g. "privacy_policy", "refund_policy", "shipping_policy", "terms_conditions"
 */
export function loadPolicy(filename: string): PolicyData {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || "s1";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Store";
  const filePath = join(process.cwd(), "public", "assets", "stores", storeId, "policies", `${filename}.html`);

  let html: string;
  try {
    html = readFileSync(filePath, "utf-8");
  } catch {
    return {
      pageTitle: "Policy",
      intro: "This policy page is not yet available.",
      sections: [],
      footer: "",
    };
  }

  // Auto-detect the brand name from <div class="brand"> and replace with env var store name
  const brandMatch = html.match(/<div\s+class="brand"[^>]*>(.*?)<\/div>/s);
  if (brandMatch) {
    const originalBrand = stripTags(brandMatch[1]).trim();
    if (originalBrand && originalBrand !== storeName) {
      html = html.replace(new RegExp(escapeRegex(originalBrand), "g"), storeName);
    }
  }

  // Extract title from <h1>
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
  const pageTitle = h1Match ? stripTags(h1Match[1]) : "Policy";

  // Extract intro - first <p> after <h1> but before any <h2>
  const afterH1 = html.split(/<\/h1>/s)[1] || "";
  const beforeFirstH2 = afterH1.split(/<h2/s)[0] || "";
  const introMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/s);
  const intro = introMatch ? stripTags(introMatch[1]) : "";

  // Extract sections: each <h2> followed by content until the next <h2> or <footer>
  const sections: PolicySection[] = [];
  const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<footer|$)/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const title = stripTags(match[1]).trim();
    const body = match[2]
      .trim()
      .replace(/<\/?div[^>]*>/g, "")
      .trim();
    sections.push({ title, body });
  }

  // Extract footer text
  const footerMatch = html.match(/<footer[^>]*>(.*?)<\/footer>/s);
  const footer = footerMatch ? stripTags(footerMatch[1]).trim() : "";

  return { pageTitle, intro, sections, footer };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
