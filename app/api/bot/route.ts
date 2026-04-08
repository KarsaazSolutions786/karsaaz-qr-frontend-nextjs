import { NextRequest, NextResponse } from "next/server";

// Server-side proxy to call external bot API and avoid CORS issues in the browser
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const res = await fetch("https://bot.karsaazsolutions.com/get-response/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      // Ensure no caching for dynamic responses
      cache: "no-store",
    });

    // Non-2xx
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: "Upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error)?.message || "Failed to fetch bot response" },
      { status: 500 }
    );
  }
}

