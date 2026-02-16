"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import cloudStorageService from "@/services/cloud-storage.service";
import type { CloudProvider } from "@/services/cloud-storage.service";

function CloudStorageCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Completing cloud storage connection...");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code     = searchParams.get("code");
    const state    = searchParams.get("state") ?? undefined;
    const provider = (searchParams.get("provider") ?? state?.split(":")?.[0]) as CloudProvider | null;
    const error    = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(`OAuth was denied: ${error}`);
      toast.error("Cloud storage connection was cancelled.");
      setTimeout(() => router.replace("/dashboard/cloud-storage"), 3000);
      return;
    }

    if (!code || !provider) {
      setStatus("error");
      setMessage("Invalid callback — missing code or provider.");
      setTimeout(() => router.replace("/dashboard/cloud-storage"), 3000);
      return;
    }

    const handleCallback = async () => {
      try {
        switch (provider) {
          case "google_drive":
            await cloudStorageService.handleGoogleDriveCallback(code, state);
            break;
          case "dropbox":
            await cloudStorageService.handleDropboxCallback(code, state);
            break;
          case "onedrive":
            await cloudStorageService.handleOneDriveCallback(code, state);
            break;
          default:
            throw new Error(`Unknown provider: ${provider}`);
        }
        setStatus("success");
        setMessage("Connected successfully! Redirecting...");
        toast.success("Cloud storage connected.");
        setTimeout(() => router.replace("/dashboard/cloud-storage"), 1500);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? (err as Error)?.message ?? "Connection failed.";
        setStatus("error");
        setMessage(msg);
        toast.error(`Failed to connect: ${msg}`);
        setTimeout(() => router.replace("/dashboard/cloud-storage"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {status === "processing" && (
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      )}
      {status === "success" && (
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {status === "error" && (
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      <p className="text-sm text-muted-foreground text-center max-w-sm">{message}</p>
    </div>
  );
}

export default function CloudStorageCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <CloudStorageCallbackContent />
    </Suspense>
  );
}
