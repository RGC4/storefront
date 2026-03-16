import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// POST /api/admin/store-config
// Body: { storeId: "s1", config: { ...StoreConfig } }
// This is how you upload/update a store config to Vercel Blob

export async function POST(req: NextRequest) {
  try {
    const { storeId, config } = await req.json();

    if (!storeId || !config) {
      return NextResponse.json({ error: "Missing storeId or config" }, { status: 400 });
    }

    const blob = await put(
      `stores/${storeId}.json`,
      JSON.stringify(config, null, 2),
      {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      }
    );

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("Failed to save store config:", err);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
