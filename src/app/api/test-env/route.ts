import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL || "NOT SET" }); }
