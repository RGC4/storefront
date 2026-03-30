// DESTINATION: src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, orderNumber, category, subject, message, priority } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const ticketId = `TKT-${date}-${rand}`;

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || "noreply@prestigeapparelgroup.com";
    const supportEmail = process.env.SUPPORT_EMAIL || "info@prestigeapparelgroup.com";

    if (resendKey) {
      const storeHtml = `
        <h2 style="color:#1a1a2e">New Support Ticket: ${ticketId}</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif">
          <tr style="background:#f5f5f5"><td><strong>From</strong></td><td>${name} &lt;${email}&gt;</td></tr>
          <tr><td><strong>Ticket ID</strong></td><td>${ticketId}</td></tr>
          <tr style="background:#f5f5f5"><td><strong>Category</strong></td><td>${category || "General"}</td></tr>
          ${orderNumber ? `<tr><td><strong>Order #</strong></td><td>${orderNumber}</td></tr>` : ""}
          <tr style="background:#f5f5f5"><td><strong>Subject</strong></td><td>${subject || "—"}</td></tr>
          <tr><td><strong>Priority</strong></td><td>${priority || "Normal"}</td></tr>
          <tr style="background:#f5f5f5"><td><strong>Submitted</strong></td><td>${new Date().toLocaleString("en-CA")}</td></tr>
        </table>
        <h3 style="margin-top:24px">Message</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:6px;white-space:pre-wrap;font-family:sans-serif">${message}</div>
      `;

      const customerHtml = `
        <p style="font-family:sans-serif">Hi ${name},</p>
        <p style="font-family:sans-serif">Thank you for contacting <strong>${storeName}</strong>. We've received your message and will respond within <strong>1–2 business days</strong>.</p>
        <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif">
          <tr><td><strong>Ticket Reference:</strong></td><td>${ticketId}</td></tr>
          ${orderNumber ? `<tr><td><strong>Order Number:</strong></td><td>#${orderNumber}</td></tr>` : ""}
        </table>
        <p style="font-family:sans-serif">If you have anything to add, simply reply to this email and include your ticket ID in the subject line.</p>
        <br/>
        <p style="font-family:sans-serif">${storeName}<br/>Customer Support Team<br/><a href="mailto:${supportEmail}">${supportEmail}</a></p>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromEmail, to: supportEmail, subject: `[Support Ticket] ${ticketId} — ${category || "General"}`, html: storeHtml }),
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromEmail, to: email, subject: `Your request has been received — ${ticketId}`, html: customerHtml }),
      });
    } else {
      console.log("📬 [CONTACT SUBMISSION — add RESEND_API_KEY to .env.local to enable emails]");
      console.log({ ticketId, name, email, category, subject, orderNumber, priority, message });
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
