"use client";

import { ResultCard } from "@/components/ui/result-card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PieceXDemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Legacy logic: Set a flag in localStorage and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.setItem('is_piecex_demo', 'true');
      
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [router]);

  return (
    <ResultCard
      status="loading"
      title="Activating Demo"
      description="We're setting up the PieceX demo environment for you. Redirecting to login in a moment..."
      icon={Loader2}
    />
  );
}
