// src/app/api/returns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";
const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "corporate@prestigeapparelgroup.com";
const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxYqYIGYTf7oLdyQI6mgaNYgkY1uDlFyHFudHAmtEm97klbRft_NgvCDLqZxZdCsgko8w/exec";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const orderNumber = formData.get("orderNumber") as string;
    const item = formData.get("item") as string;
    const reason = formData.get("reason") as string;
    const resolution = formData.get("resolution") as string;
    const notes = formData.get("notes") as string || "";

    if (!name || !email || !orderNumber || !item) {
      return NextResponse.json({ error: "Name, email, order number, and item are required." }, { status: 400 });
    }

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const returnId = `RET-${date}-${rand}`;

    // Upload photos to Vercel Blob
    const photoUrls: string[] = [];
    const photoFiles = formData.getAll("photos") as File[];
    for (let i = 0; i < Math.min(photoFiles.length, 5); i++) {
      const file = photoFiles[i];
      if (file && file.size > 0) {
        try {
          const blob = await put(
            `returns/${returnId}/photo-${i + 1}.${file.name.split(".").pop() || "jpg"}`,
            file,
            { access: "public" }
          );
          photoUrls.push(blob.url);
        } catch (uploadErr) {
          console.error(`Photo ${i + 1} upload failed:`, uploadErr);
        }
      }
    }

    // Log to Google Sheets
    try {
      await fetch(SHEETS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }),
          returnId,
          store: storeName,
          name,
          email,
          orderNumber,
          item,
          reason,
          resolution,
          notes,
          photos: photoUrls,
        }),
      });
    } catch (sheetErr) {
      console.error("Google Sheets log failed:", sheetErr);
    }

    // Send emails
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || "noreply@prestigeapparelgroup.com";
    const supportEmail = process.env.SUPPORT_EMAIL || storeEmail;

    if (resendKey) {
      // Photo HTML for store notification
      const photosHtml = photoUrls.length > 0
        ? `<h3 style="margin-top:24px">Photos (${photoUrls.length})</h3>
           <div style="display:flex;gap:12px;flex-wrap:wrap">
             ${photoUrls.map((url, i) => `<a href="${url}" target="_blank"><img src="${url}" alt="Photo ${i + 1}" style="width:120px;height:120px;object-fit:cover;border-radius:6px;border:1px solid #ddd" /></a>`).join("")}
           </div>`
        : "";

      // Notify store
      const storeHtml = `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#1a1a2e;margin-bottom:4px">New Return Request: ${returnId}</h2>
          <table cellpadding="8" style="border-collapse:collapse;width:100%;border:1px solid #e8e8e8">
            <tr style="background:#f5f5f5"><td><strong>From</strong></td><td>${name} &lt;${email}&gt;</td></tr>
            <tr><td><strong>Return ID</strong></td><td>${returnId}</td></tr>
            <tr style="background:#f5f5f5"><td><strong>Store</strong></td><td>${storeName}</td></tr>
            <tr><td><strong>Order #</strong></td><td>${orderNumber}</td></tr>
            <tr style="background:#f5f5f5"><td><strong>Item</strong></td><td>${item}</td></tr>
            <tr><td><strong>Reason</strong></td><td>${reason}</td></tr>
            <tr style="background:#f5f5f5"><td><strong>Resolution</strong></td><td>${resolution}</td></tr>
            <tr><td><strong>Date</strong></td><td>${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</td></tr>
          </table>
          ${notes ? `<h3 style="margin-top:24px">Additional Notes</h3><div style="background:#f9f9f9;padding:16px;border-radius:6px;white-space:pre-wrap">${notes}</div>` : ""}
          ${photosHtml}
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: supportEmail,
          subject: `[Return Request] ${returnId} — Order #${orderNumber} — ${reason}`,
          html: storeHtml,
        }),
      });

      // Confirm to customer
      const customerHtml = `
        <div style="font-family:sans-serif;max-width:600px">
          <p>Hi ${name},</p>
          <p>Thank you for contacting <strong>${storeName}</strong>. We've received your return request and will be in touch within <strong>1–2 business days</strong> with next steps, including your prepaid return shipping label.</p>
          <table cellpadding="8" style="border-collapse:collapse;border:1px solid #e8e8e8">
            <tr><td><strong>Return Reference:</strong></td><td>${returnId}</td></tr>
            <tr><td><strong>Order #:</strong></td><td>${orderNumber}</td></tr>
            <tr><td><strong>Item:</strong></td><td>${item}</td></tr>
            <tr><td><strong>Reason:</strong></td><td>${reason}</td></tr>
            <tr><td><strong>Requested Resolution:</strong></td><td>${resolution}</td></tr>
          </table>
          <p><strong>Please hold onto your item</strong> and do not ship anything back until you receive your return label and instructions from us.</p>
          <br/>
          <p>${storeName}<br/>Customer Support Team<br/><a href="mailto:${supportEmail}">${supportEmail}</a></p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          reply_to: supportEmail,
          subject: `Your return request has been received — ${returnId}`,
          html: customerHtml,
        }),
      });
    } else {
      console.log("📬 [RETURN REQUEST — add RESEND_API_KEY to enable emails]");
      console.log({ returnId, name, email, orderNumber, item, reason, resolution, notes, photoUrls });
    }

    return NextResponse.json({ success: true, ticketId: returnId });
  } catch (err: any) {
    console.error("Returns API error:", err);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
