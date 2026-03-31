// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "corporate@prestigeapparelgroup.com";
const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbyJ9Xvu-2sm5pne-mvW3gNMqYfVG9j81SrBNROUCo_LQxHPHReXjzzLQryqsH_N911w/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, interests, brands } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || "noreply@prestigeapparelgroup.com";
    const notifyEmail = process.env.SUPPORT_EMAIL || storeEmail;
    const firstName = (name || "").trim().split(/\s+/)[0] || "";
    const greeting = firstName ? `Hi ${firstName}` : "Hi there";

    // 1. Log to Google Sheets
    try {
      await fetch(SHEETS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }),
          store: storeName,
          email,
          name: name || "",
          interests: interests || "",
          brands: brands || "",
          source: "newsletter",
        }),
      });
    } catch (sheetErr) {
      console.error("Google Sheets log failed:", sheetErr);
    }

    if (resendKey) {
      // 2. Notify you at corporate
      const notifyHtml = `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#1a1a2e;margin-bottom:4px">New Email List Subscriber</h2>
          <p style="color:#666;margin-top:0">Someone just joined the ${storeName} mailing list.</p>
          <table cellpadding="10" style="border-collapse:collapse;width:100%;border:1px solid #e8e8e8">
            <tr style="background:#f9f9f9"><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Name</strong></td><td>${name || "Not provided"}</td></tr>
            <tr style="background:#f9f9f9"><td><strong>Store</strong></td><td>${storeName}</td></tr>
            <tr><td><strong>Interested In</strong></td><td>${interests || "Not specified"}</td></tr>
            <tr style="background:#f9f9f9"><td><strong>Favorite Brands</strong></td><td>${brands || "Not specified"}</td></tr>
            <tr><td><strong>Date</strong></td><td>${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</td></tr>
          </table>
          ${(interests || brands) ? `<div style="margin-top:16px;padding:14px;background:#f0f7ff;border-left:4px solid #3b82f6;border-radius:4px"><strong>Concierge Note:</strong> This subscriber expressed specific interests. Consider a personal follow-up.</div>` : ""}
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: notifyEmail,
          subject: `[${storeName}] New Subscriber: ${email}${(interests || brands) ? " — Has specific interests" : ""}`,
          html: notifyHtml,
        }),
      });

      // 3. Send subscriber a welcome email
      const interestsSection = (interests || brands) ? `
          <div style="background:#f0f7ff;padding:20px;border-radius:8px;margin:0 0 24px">
            <h3 style="font-size:17px;color:#1a1a2e;margin:0 0 8px">We Noted Your Preferences</h3>
            ${interests ? `<p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 8px">Interested in: <strong>${interests}</strong></p>` : ""}
            ${brands ? `<p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 8px">Favorite brands: <strong>${brands}</strong></p>` : ""}
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0">
              Our concierge team will keep an eye out for pieces that match your taste.
              If we find something special, we'll reach out personally.
            </p>
          </div>
      ` : "";

      const subscriberHtml = `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#222">

          <!-- HEADER -->
          <div style="text-align:center;padding:32px 0 24px;border-bottom:2px solid #b8972e">
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#1a1a2e;letter-spacing:1px">${storeName}</h1>
            <p style="margin:6px 0 0;font-size:14px;color:#888;letter-spacing:2px;text-transform:uppercase">Your Online Boutique</p>
          </div>

          <!-- WELCOME -->
          <div style="padding:32px 0 24px">
            <h2 style="font-size:22px;color:#1a1a2e;margin:0 0 12px">${greeting}, Welcome to the ${storeName} Family</h2>
            <p style="font-size:16px;line-height:1.7;color:#444">
              Thank you for joining our mailing list! We're thrilled to have you as part of our community.
              You'll be the first to hear about new arrivals, exclusive offers, and curated style guides.
            </p>
          </div>

          ${interestsSection}

          <!-- FASHION TRENDS -->
          <div style="background:#fdfaf4;padding:24px;border-left:4px solid #b8972e;margin:0 0 28px">
            <h3 style="font-size:18px;color:#1a1a2e;margin:0 0 12px">What's Trending Right Now</h3>
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 12px">
              <strong>Quiet Luxury</strong> continues to dominate — think understated elegance, premium materials, and timeless silhouettes
              that speak for themselves. Clean lines and neutral palettes are everywhere this season.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 12px">
              <strong>Italian Craftsmanship</strong> is having a major moment. Shoppers are moving away from fast fashion toward
              pieces with real heritage — hand-stitched leather, artisan hardware, and designs that age beautifully.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0">
              <strong>Versatile Investment Pieces</strong> — bags and accessories that transition effortlessly from day to evening
              are the smartest additions to any wardrobe. One great bag can elevate every outfit you own.
            </p>
          </div>

          <!-- CONCIERGE SERVICE -->
          <div style="background:#1a1a2e;padding:24px;border-radius:8px;margin:0 0 28px;text-align:center">
            <h3 style="font-size:18px;color:#b8972e;margin:0 0 10px;letter-spacing:1px">Personal Concierge Service</h3>
            <p style="font-size:15px;line-height:1.7;color:rgba(255,255,255,0.85);margin:0 0 12px">
              Looking for something specific? Our concierge team provides personalized shopping assistance — from
              sourcing hard-to-find pieces to helping you build the perfect collection. We're here to help.
            </p>
            <p style="font-size:15px;color:rgba(255,255,255,0.85);margin:0">
              Simply reply to this email or reach us at
              <a href="mailto:${storeEmail}" style="color:#b8972e;font-weight:600">${storeEmail}</a>
            </p>
          </div>

          <!-- FEEDBACK REQUEST -->
          <div style="background:#f0f4f8;padding:24px;border-radius:8px;margin:0 0 28px">
            <h3 style="font-size:18px;color:#1a1a2e;margin:0 0 10px">Help Us Serve You Better</h3>
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 12px">
              Is there anything you'd love to see in our store? A particular brand, style, or product category
              that would make your life easier? We read every response and genuinely want to hear from you.
            </p>
            <p style="font-size:15px;line-height:1.7;color:#444;margin:0">
              Just reply to this email with your ideas — your input shapes what we carry.
            </p>
          </div>

          <!-- FOOTER -->
          <div style="border-top:1px solid #e8e8e8;padding:20px 0 0;text-align:center">
            <p style="font-size:13px;color:#999;margin:0">
              ${storeName}<br/>
              <a href="mailto:${storeEmail}" style="color:#b8972e">${storeEmail}</a>
            </p>
            <p style="font-size:11px;color:#bbb;margin:12px 0 0">
              You're receiving this because you signed up at ${storeName}. We respect your inbox and won't spam you.
            </p>
          </div>

        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          reply_to: storeEmail,
          subject: `Welcome to ${storeName} — Here's What's Trending`,
          html: subscriberHtml,
        }),
      });
    } else {
      console.log("📬 [NEWSLETTER SIGNUP — add RESEND_API_KEY to enable emails]");
      console.log({ email, name, interests, brands, store: storeName, date: new Date().toISOString() });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
