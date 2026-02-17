"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PiecexDemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo flag
    if (typeof window !== "undefined") {
      localStorage.setItem("is_piecex_demo", "true");
    }

    // Redirect after delay
    const timer = setTimeout(() => {
      router.push("/account/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Redirecting you now...</h1>
        <p className="text-sm text-muted-foreground">Setting up demo environment</p>
      </div>
    </div>
  );
}
