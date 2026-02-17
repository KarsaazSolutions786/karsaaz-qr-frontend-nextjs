"use client";

import { ResultCard } from "@/components/ui/result-card";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmailVerifiedPage() {
  const router = useRouter();

  return (
    <ResultCard
      status="success"
      title="Email Verified"
      description="Your email address has been successfully verified. You can now access all features of Karsaaz QR."
      icon={CheckCircle2}
      primaryAction={{
        label: "Login to Account",
        onClick: () => router.push("/login"),
      }}
    />
  );
}
