"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

// In a real implementation, this would fetch from API
async function getQRCode(slug: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock logic - in production this checks backend
  if (slug === "404") return null;
  return {
    id: "123",
    type: "url",
    url: "https://example.com",
    slug
  };
}

export default function QRCodeCatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Reserved routes check
  const reserved = ["dashboard", "login", "register", "account", "api", "blog", "pricing"];
  if (reserved.includes(slug)) {
    return notFound();
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Redirecting...</h1>
        <p className="text-sm text-muted-foreground">
          Resolving QR Code: <span className="font-mono font-bold">{slug}</span>
        </p>
      </div>
    </div>
  );
}
