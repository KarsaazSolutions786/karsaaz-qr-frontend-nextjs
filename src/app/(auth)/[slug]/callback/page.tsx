"use client";

import { ResultCard } from "@/components/ui/result-card";
import { useApi } from "@/hooks/use-api";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function OAuthCallbackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const provider = slug;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { call, isLoading } = useApi();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token") || searchParams.get("access_token");
      const secret = searchParams.get("secret"); // For Twitter

      if (!token) {
        setError("Missing authentication token from provider.");
        return;
      }

      try {
        let res;
        if (provider === "google") {
          res = await call(() => authService.googleLogin(token));
        } else if (provider === "facebook") {
          res = await call(() => authService.facebookLogin(token));
        } else if (provider === "twitter") {
          res = await call(() => authService.twitterLogin(token, secret || ""));
        } else {
          throw new Error("Unsupported authentication provider.");
        }

        if (res?.token && res?.user) {
          setAuth(res.user, res.token);
          toast.success(`Successfully logged in via ${provider}!`);
          router.push("/dashboard");
        }
      } catch (err: any) {
        console.error("OAuth Login Failed:", err);
        setError(err.message || `Failed to authenticate with ${provider}.`);
      }
    };

    handleCallback();
  }, [provider, searchParams, call, setAuth, router]);

  if (error) {
    return (
      <ResultCard
        status="error"
        title="Authentication Failed"
        description={error}
        icon={ShieldAlert}
        primaryAction={{
          label: "Return to Login",
          onClick: () => router.push("/login"),
        }}
      />
    );
  }

  return (
    <ResultCard
      status="loading"
      title="Authenticating..."
      description={`Completing your secure login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Please wait...`}
      icon={Loader2}
    />
  );
}
