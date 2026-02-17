"use client";

import { ResultCard } from "@/components/ui/result-card";
import { useApi } from "@/hooks/use-api";
import { authService, LoginResponse } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function OAuthCallbackPage({ params }: { params: Promise<{ slug: string }> }) {
  // Use React.use() to unwrap the params promise
  // This is the correct pattern for Next.js 15 client components with dynamic routes
  const unwrappedParams = use(params);
  const provider = unwrappedParams?.slug || "";

  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { call } = useApi<LoginResponse>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Determine provider from slug if available, or fallback
    if (!provider) return;

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
          // Fallback or error if provider is unknown
          throw new Error(`Unsupported authentication provider: ${provider}`);
        }

        if (res?.token && res?.user) {
          setAuth(res.user, res.token);
          toast.success("Successfully logged in!");
          setIsSuccess(true);

          // Small delay before redirect to show success state
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: unknown) {
        console.error("OAuth Login Failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to authenticate.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [provider, searchParams, call, setAuth, router]);

  if (isLoading) {
    return (
      <ResultCard
        status="loading"
        title="Verifying..."
        description="Please wait while we verify your authentication."
        icon={Loader2}
      />
    );
  }

  if (error) {
    return (
      <ResultCard
        status="error"
        title="Authentication Failed"
        description={error}
        icon={ShieldAlert}
        primaryAction={{
          label: "Back to Login",
          onClick: () => router.push("/login"),
        }}
      />
    );
  }

  if (isSuccess) {
    return (
      <ResultCard
        status="success"
        title="Authentication Successful"
        description="You have been successfully authenticated. Redirecting to dashboard..."
        icon={Loader2}
      />
    );
  }

  // Fallback for unexpected states, though ideally covered by isLoading/error/isSuccess
  return (
    <ResultCard
      status="loading"
      title="Processing..."
      description="Finalizing your authentication. Please wait..."
      icon={Loader2}
    />
  );
}
