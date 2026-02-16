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
import { cn } from "@/lib/utils";
import billingService, { SubscriptionPlan } from "@/services/billing.service";
import checkoutService from "@/services/checkout.service";
import stripeService from "@/services/stripe.service";
import { CheckCircle, CreditCard, Gift, Loader2, Tag, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentProcessor {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan_id");

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [processors, setProcessors] = useState<PaymentProcessor[]>([]);
  const [activeProcessor, setActiveProcessor] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!planId) return;
    const init = async () => {
      try {
        const [planRes, procRes] = await Promise.all([
          billingService.getPlan(planId),
          checkoutService.getPaymentProcessors(),
        ]);
        const planData = planRes.data ?? planRes;
        setPlan(planData);

        const procData = procRes.data ?? procRes;
        const list = Array.isArray(procData) ? procData : procData.data ?? [];
        setProcessors(list.filter((p: PaymentProcessor) => p.is_active));
        if (list.length > 0) setActiveProcessor(list[0].slug);
      } catch (err) {
        console.error("Failed to load checkout", err);
        toast.error("Failed to load checkout");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [planId]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await checkoutService.validatePromoCode(promoCode);
      setPromoApplied(res.data ?? res);
      toast.success("Promo code applied!");
    } catch {
      toast.error("Invalid promo code");
      setPromoApplied(null);
    }
  };

  const handleCheckout = async () => {
    if (!plan) return;
    setProcessing(true);
    try {
      if (activeProcessor === "stripe") {
        const res = await stripeService.createCheckoutSession({
          plan_id: plan.id,
          promo_code: promoApplied ? promoCode : undefined,
        });
        const data = res.data ?? res;
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } else if (activeProcessor === "account-credit") {
        await checkoutService.payWithAccountCredit({ plan_id: plan.id });
        toast.success("Payment successful!");
        router.push("/account/subscriptions");
        return;
      } else if (activeProcessor === "free") {
        await checkoutService.activateFreePlan({ plan_id: plan.id });
        toast.success("Plan activated!");
        router.push("/account/subscriptions");
        return;
      } else {
        const res = await checkoutService.createSession(activeProcessor, {
          plan_id: plan.id,
        });
        const data = res.data ?? res;
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
      toast.success("Checkout initiated!");
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(price);

  if (!planId) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-xl font-bold mb-4">No plan selected</h2>
        <Button onClick={() => router.push("/pricing")}>View Plans</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6">
        {/* Plan Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {plan?.name}
            </CardTitle>
            <CardDescription>{plan?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price</span>
              <span className="text-2xl font-bold">
                {plan ? formatPrice(plan.price, plan.currency) : "—"}
                <span className="text-sm font-normal text-gray-500">
                  /{plan?.frequency === "yearly" ? "yr" : "mo"}
                </span>
              </span>
            </div>
            {plan?.is_trial && plan.trial_days > 0 && (
              <div className="mt-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md">
                Includes {plan.trial_days}-day free trial
              </div>
            )}
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" /> Promo Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button variant="outline" onClick={handleApplyPromo}>
                Apply
              </Button>
            </div>
            {promoApplied && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Discount applied: {promoApplied.discount || promoApplied.description || "Valid"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            {processors.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No payment processors configured. Please contact support.
              </p>
            ) : (
              <div className="space-y-3">
                {processors.map((proc) => (
                  <button
                    key={proc.slug}
                    onClick={() => setActiveProcessor(proc.slug)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left",
                      activeProcessor === proc.slug
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    {proc.slug === "stripe" ? (
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    ) : proc.slug === "account-credit" ? (
                      <Wallet className="h-5 w-5 text-green-500" />
                    ) : (
                      <Gift className="h-5 w-5 text-purple-500" />
                    )}
                    <span className="font-medium">{proc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={processing || !activeProcessor}
          onClick={handleCheckout}
        >
          {processing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          {processing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
