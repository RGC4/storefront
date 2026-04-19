// src/lib/policyLoader.ts
// ============================================================
// Loads policy HTML from Vercel Blob at request time.
// No redeploy needed to update a policy — just upload-asset.ts
// and it's live on the next page request.
//
// Falls back gracefully if Blob is unavailable.
// ============================================================

import { head } from "@vercel/blob";

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

// Section titles stripped automatically (contact info is in the banner)
const STRIPPED_SECTION_PATTERNS = [
  /^(?:\d+\.\s*)?contact(?:\s+us|\s+information|\s+details)?$/i,
];

const FALLBACK: PolicyData = {
  pageTitle: "Policy",
  intro: "This policy page is not yet available.",
  sections: [],
  footer: "",
};

// ── In-memory cache per storeId+filename ─────────────────────
// Avoids hitting Blob on every request. TTL: 5 minutes.
// For 50 stores × 5 policies = 250 possible entries — tiny footprint.

const policyCache = new Map<string, { data: PolicyData; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(storeId: string, filename: string) {
  return `${storeId}:${filename}`;
}

// ── Main export ───────────────────────────────────────────────

export async function loadPolicy(filename: string): Promise<PolicyData> {
  const storeId   = process.env.NEXT_PUBLIC_STORE_ID    || "s1";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME  || "Store";
  const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "";

  const key = cacheKey(storeId, filename);
  const cached = policyCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const blobPath = `stores/${storeId}/policies/${filename}.html`;
    const blob = await head(blobPath).catch(() => null);

    if (!blob) {
      console.warn(`[policyLoader] No blob found at ${blobPath}`);
      return FALLBACK;
    }

   const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[policyLoader] fetch failed for ${blobPath}: status=${res.status} url=${blob.url}`);
      return FALLBACK;
    }

    let html = await res.text();

    // ── Same transforms as before ──────────────────────────

    // Strip fine-print paragraphs
    html = html.replace(/<p[^>]*class\s*=\s*["']fine-print["'][^>]*>[\s\S]*?<\/p>/gi, "");

    // Strip "operated by RGC4" references
    html = html.replace(/<p[^>]*>[^<]*operated by RGC4[^<]*<\/p>/gi, "");

    // Replace brand name from HTML with store name
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

    // Replace first mailto with store email
    if (storeEmail) {
      const emailMatch = html.match(/mailto:([^"'\s]+)/);
      if (emailMatch) {
        const originalEmail = emailMatch[1];
        if (originalEmail && originalEmail !== storeEmail) {
          html = html.replace(new RegExp(escapeRegex(originalEmail), "g"), storeEmail);
        }
      }
    }

    // ── Parse structure ────────────────────────────────────

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

    const sections: PolicySection[] = [];
    const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<footer|<\/main|<\/body|$)/gi;
    let match;
    while ((match = sectionRegex.exec(html)) !== null) {
      const title = stripTags(match[1]).trim();
      const isContact = STRIPPED_SECTION_PATTERNS.some((p) => p.test(title));
      if (isContact) continue;

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
    const data: PolicyData = { pageTitle, intro, sections, footer };

    policyCache.set(key, { data, fetchedAt: Date.now() });
    return data;

  } catch (err) {
    console.error(`[policyLoader] Failed to load policy "${filename}" for store "${storeId}":`, err);
    return FALLBACK;
  }
}

// ── Helpers ───────────────────────────────────────────────────

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
