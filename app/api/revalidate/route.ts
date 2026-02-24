import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 15 On-Demand Revalidation API Route (Simplified)
 *
 * WordPress calls this endpoint to trigger cache revalidation when:
 * - A new product is added
 * - A new listing (place) is created
 * - Existing content is updated
 *
 * Usage from WordPress:
 * POST https://yourdomain.com/api/revalidate
 * Headers: { "x-revalidate-secret": "YOUR_SECRET_TOKEN" }
 * Body: { "type": "product" | "vendor" | "storefront", "slug": "item-slug" }
 */

// ============================================
// 🔐 GLOBAL CONFIGURATION
// ============================================
// Change this secret token to match your WordPress plugin settings
const REVALIDATE_SECRET_TOKEN = "test-secret-token-12345";

// Expected secret (for now, same as the token - can be different in production)
const EXPECTED_SECRET = REVALIDATE_SECRET_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify secret token for security
    const secret = request.headers.get("x-revalidate-secret");

    if (secret !== EXPECTED_SECRET) {
      console.warn("⚠️ Invalid revalidation secret attempt");
      return NextResponse.json(
        { error: "Invalid secret token" },
        { status: 401 },
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { type, slug } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 },
      );
    }

    console.log("🔄 Revalidation request:", { type, slug });

    // 3. Track revalidated paths
    const revalidatedPaths: string[] = [];

    // 4. Revalidate based on content type
    switch (type) {
      case "product":
        // Revalidate individual product page if slug provided
        if (slug) {
          await revalidatePath(`/products/${slug}`);
          revalidatedPaths.push(`/products/${slug}`);
        }

        // Always revalidate products listing page
        await revalidatePath("/products");
        revalidatedPaths.push("/products");

        break;

      case "vendor":
        // Revalidate individual vendor page if slug provided
        if (slug) {
          await revalidatePath(`/vendors/${slug}`);
          revalidatedPaths.push(`/vendors/${slug}`);
        }

        // Always revalidate vendors listing page
        await revalidatePath("/vendors");
        revalidatedPaths.push("/vendors");

        break;

      case "storefront":
        // Revalidate individual storefront page if slug provided
        if (slug) {
          await revalidatePath(`/store-front/${slug}`);
          revalidatedPaths.push(`/store-front/${slug}`);
        }

        // Also revalidate vendors listing (storefronts are vendors)
        await revalidatePath("/vendors");
        revalidatedPaths.push("/vendors");

        break;

      case "all":
        // Revalidate everything
        await revalidatePath("/products");
        await revalidatePath("/vendors");
        revalidatedPaths.push("/products", "/vendors");

        break;

      default:
        return NextResponse.json(
          {
            error: "Invalid type",
            message: `Type must be one of: product, vendor, storefront, all. Got: ${type}`,
          },
          { status: 400 },
        );
    }

    // 5. Return success response
    const response = {
      success: true,
      revalidated: true,
      timestamp: new Date().toISOString(),
      type,
      slug,
      paths: revalidatedPaths,
    };

    console.log("✅ Revalidation successful:", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("❌ Revalidation error:", error);

    return NextResponse.json(
      {
        error: "Revalidation failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// GET method for testing/health check
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== EXPECTED_SECRET) {
    return NextResponse.json(
      { error: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    status: "ok",
    message: "Revalidation endpoint is working",
    timestamp: new Date().toISOString(),
    routes: {
      products: "/products/[slug] and /products",
      vendors: "/vendors/[slug] and /vendors",
      storefronts: "/store-front/[slug] and /vendors",
    },
    usage: {
      method: "POST",
      headers: {
        "x-revalidate-secret": REVALIDATE_SECRET_TOKEN,
      },
      body: {
        type: "product | vendor | storefront | all",
        slug: "item-slug (optional)",
      },
    },
  });
}
