import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET_TOKEN = "geo-directory-secret-2024";

export async function POST(request: NextRequest) {
  try {
    // Check token from header
    const token = request.headers.get("x-revalidate-token");

    if (token !== SECRET_TOKEN) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    console.log("🔄 Revalidating geo directory listings...");

    // Revalidate the listing tag
    revalidateTag("listings", "max");

    console.log("✅ Geo directory cache revalidated!");

    return NextResponse.json({
      success: true,
      message: "Geo directory revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Revalidation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Test with GET
export async function GET(request: NextRequest) {
  const token = request.headers.get("x-revalidate-token");

  if (token !== SECRET_TOKEN) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  revalidateTag("listings", "max");

  return NextResponse.json({
    success: true,
    message: "Geo directory revalidated (test)",
    timestamp: new Date().toISOString(),
  });
}
