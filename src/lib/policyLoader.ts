// src/lib/policyLoader.ts
// Reads policy HTML files from public/assets/stores/{storeId}/policies/
// Extracts structured content for rendering in the site's MUI theme.
// Auto-replaces brand name, contact email, and footer with env var values.

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
  const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "";
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

  // Auto-detect the brand name from <div class="brand"> or <header class="brand"> and replace with env var
  const brandMatch = html.match(/<(?:div|header)\s+class="brand"[^>]*>([\s\S]*?)<\/(?:div|header)>/);
  if (brandMatch) {
    const originalBrand = stripTags(brandMatch[1]).trim().split(/\s+/).slice(0, 5).join(" ");
    if (originalBrand && originalBrand !== storeName) {
      // Try to replace the h1 inside the brand block
      const brandH1 = brandMatch[1].match(/<h1[^>]*>(.*?)<\/h1>/s);
      if (brandH1) {
        const brandName = stripTags(brandH1[1]).trim();
        if (brandName && brandName !== storeName) {
          html = html.replace(new RegExp(escapeRegex(brandName), "g"), storeName);
        }
      }
    }
  }

  // Auto-detect the contact email from first mailto: link and replace with env var
  if (storeEmail) {
    const emailMatch = html.match(/mailto:([^"'\s]+)/);
    if (emailMatch) {
      const originalEmail = emailMatch[1];
      if (originalEmail && originalEmail !== storeEmail) {
        html = html.replace(new RegExp(escapeRegex(originalEmail), "g"), storeEmail);
      }
    }
  }

  // Extract title — prefer <h1 class="policy-title">, fall back to last <h1>
  let pageTitle = "Policy";
  const policyTitleMatch = html.match(/<h1[^>]*class="[^"]*policy-title[^"]*"[^>]*>(.*?)<\/h1>/s);
  if (policyTitleMatch) {
    pageTitle = stripTags(policyTitleMatch[1]);
  } else {
    // Fall back: grab all h1s and use the last one (skips brand header)
    const allH1s = html.match(/<h1[^>]*>(.*?)<\/h1>/gs);
    if (allH1s && allH1s.length > 0) {
      const lastH1 = allH1s[allH1s.length - 1];
      const inner = lastH1.match(/<h1[^>]*>(.*?)<\/h1>/s);
      if (inner) pageTitle = stripTags(inner[1]);
    }
  }

  // Extract intro — first <p> after the policy title but before any <h2>
  const titleSplit = policyTitleMatch
    ? html.split(policyTitleMatch[0])[1] || ""
    : html.split(/<\/h1>/s).slice(-1)[0] || "";
  const beforeFirstH2 = titleSplit.split(/<h2/s)[0] || "";
  const introMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/s);
  const intro = introMatch ? stripTags(introMatch[1]) : "";

  // Extract sections: each <h2> followed by content until the next <h2> or <footer>
  const sections: PolicySection[] = [];
  const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<footer|<\/main|<\/body|$)/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const title = stripTags(match[1]).trim();
    const body = match[2]
      .trim()
      .replace(/<\/?div[^>]*>/g, "")
      .replace(/<p\s+class="fine-print"[^>]*>[\s\S]*?<\/p>/g, "") // strip fine-print footer line
      .trim();
    sections.push({ title, body });
  }

  // Generate a clean footer using store name — no parent company reference
  const footer = `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`;

  return { pageTitle, intro, sections, footer };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
