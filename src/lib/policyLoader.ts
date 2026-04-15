// src/lib/policyLoader.ts
import { readFileSync } from "fs";
import { join } from "path";

export interface PolicySection {
  title: string;
  body: string;
}

export interface PolicyData {
  pageTitle: string;
  intro: string;
  sections: PolicySection[];
  footer: string;
}

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

  // Strip fine-print paragraphs
  html = html.replace(/<p[^>]*class\s*=\s*["']fine-print["'][^>]*>[\s\S]*?<\/p>/gi, "");

  // Strip any "operated by RGC4" lines permanently (all stores, all templates)
  html = html.replace(/<p[^>]*>.*?operated by RGC4.*?<\/p>/gi, "");

  // Auto-detect the brand name from <div class="brand"> or <header class="brand">
  const brandMatch = html.match(/<(?:div|header)\s+class\s*=\s*["']brand["'][^>]*>([\s\S]*?)<\/(?:div|header)>/i);
  if (brandMatch) {
    const brandH1 = brandMatch[1].match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (brandH1) {
      const brandName = stripTags(brandH1[1]).trim();
      if (brandName && brandName !== storeName) {
        html = html.replace(new RegExp(escapeRegex(brandName), "g"), storeName);
      }
    }
  }

  // Auto-detect the contact email from first mailto: link
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
  const policyTitleMatch = html.match(/<h1[^>]*class\s*=\s*["'][^"']*policy-title[^"']*["'][^>]*>(.*?)<\/h1>/si);
  if (policyTitleMatch) {
    pageTitle = stripTags(policyTitleMatch[1]);
  } else {
    const allH1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gsi)];
    if (allH1s.length > 1) {
      pageTitle = stripTags(allH1s[allH1s.length - 1][1]);
    } else if (allH1s.length === 1) {
      pageTitle = stripTags(allH1s[0][1]);
    }
  }

  // Extract intro — first <p> after the policy title but before any <h2>
  let afterTitle = "";
  if (policyTitleMatch) {
    afterTitle = html.split(policyTitleMatch[0])[1] || "";
  } else {
    const parts = html.split(/<\/h1>/si);
    afterTitle = parts[parts.length - 1] || "";
  }
  const beforeFirstH2 = afterTitle.split(/<h2/si)[0] || "";
  const introMatch = beforeFirstH2.match(/<p[^>]*>(.*?)<\/p>/si);
  const intro = introMatch ? stripTags(introMatch[1]) : "";

  // Extract sections: each <h2> followed by content until the next <h2> or end
  const sections: PolicySection[] = [];
  const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<footer|<\/main|<\/body|$)/gi;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const title = stripTags(match[1]).trim();
    let body = match[2]
      .trim()
      .replace(/<\/?div[^>]*>/g, "")
      .replace(/<\/?main[^>]*>/g, "")
      .replace(/<\/?body[^>]*>/g, "")
      .replace(/<\/?html[^>]*>/g, "")
      .trim();

    if (body && stripTags(body).trim()) {
      sections.push({ title, body });
    }
  }

  const footer = `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`;

  return { pageTitle, intro, sections, footer };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
