import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify the token with Cloudflare Turnstile
    const secretKey = process.env.CLOUDFLARE_SECRET_KEY;

    if (!secretKey) {
      console.error("CLOUDFLARE_SECRET_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Turnstile verification failed",
          details: verifyData["error-codes"] || [],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
