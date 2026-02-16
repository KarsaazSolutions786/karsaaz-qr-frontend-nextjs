"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import checkoutService from "@/services/checkout.service";
import { Check, Copy, Gift, Loader2, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PromoCodesPage() {
  const [myCode, setMyCode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMyCode = async () => {
      try {
        const res = await checkoutService.getMyPromoCode();
        const data = res.data ?? res;
        setMyCode(data);
      } catch {
        // User may not have a promo code
      } finally {
        setLoading(false);
      }
    };
    fetchMyCode();
  }, []);

  const handleCopy = () => {
    if (myCode?.code) {
      navigator.clipboard.writeText(myCode.code);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleValidate = async () => {
    if (!code.trim()) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await checkoutService.validatePromo({ code });
      setValidationResult({
        valid: true,
        ...(res.data ?? res),
      });
    } catch {
      setValidationResult({ valid: false });
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Promo Codes</h1>

      {/* My Promo Code */}
      {myCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Your Promo Code
            </CardTitle>
            <CardDescription>
              Share your code with friends to earn referral rewards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono text-lg font-bold tracking-wider">
                {myCode.code}
              </div>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {myCode.usage_count !== undefined && (
              <p className="mt-3 text-sm text-muted-foreground">
                Used {myCode.usage_count} time{myCode.usage_count !== 1 ? "s" : ""}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validate a Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Validate a Promo Code
          </CardTitle>
          <CardDescription>
            Enter a promo code to check if it&apos;s valid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            />
            <Button onClick={handleValidate} disabled={validating}>
              {validating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Validate"
              )}
            </Button>
          </div>
          {validationResult && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${validationResult.valid
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700"
                }`}
            >
              {validationResult.valid
                ? `✓ Valid! ${validationResult.discount || validationResult.description || "This promo code is valid."}`
                : "✗ Invalid promo code or already used."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
