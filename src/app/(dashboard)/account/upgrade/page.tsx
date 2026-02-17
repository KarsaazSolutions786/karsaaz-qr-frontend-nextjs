"use client";

import { useConfig } from "@/hooks/use-config";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HostedUpgradePage() {
  const { config, settings, loading } = useConfig();
  const [customHtml, setCustomHtml] = useState<string>("");

  useEffect(() => {
    // Legacy behavior: The actual upgrade UI is often injected via custom code
    // from the admin panel's "Account Upgrade: Hosted Upgrade Page" position.
    if (settings?.custom_codes) {
      const upgradeCode = settings.custom_codes.find(
        (c: any) => c.position === "Account Upgrade: Hosted Upgrade Page"
      );
      if (upgradeCode) {
        setCustomHtml(upgradeCode.code);
      }
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
          Upgrade Your Account <Sparkles className="h-6 w-6 text-blue-600" />
        </h1>
        <p className="text-muted-foreground uppercase font-bold tracking-widest text-xs">
          Unlock premium features and higher limits
        </p>
      </div>

      {customHtml ? (
        <div
          className="bg-card rounded-[2rem] border-2 shadow-sm p-8"
          dangerouslySetInnerHTML={{ __html: customHtml }}
        />
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border-2 border-blue-100 dark:border-blue-900/50 p-12 text-center space-y-4">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            No custom upgrade UI configured. Please visit the pricing page to select a plan.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all"
          >
            View Pricing Plans
          </a>
        </div>
      )}
    </div>
  );
}
