"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import billingService, { SubscriptionPlan } from "@/services/billing.service";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await billingService.getPlans();
        const data = res.data ?? res;
        setPlans(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error("Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(
    (p) =>
      p.frequency === billingCycle ||
      p.frequency === "ONE_TIME" ||
      !p.frequency
  );

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Choose the plan that&apos;s right for your business.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium",
              billingCycle === "monthly"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle((c) =>
                c === "monthly" ? "yearly" : "monthly"
              )
            }
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium",
              billingCycle === "yearly"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500"
            )}
          >
            Yearly
            <span className="ml-1 text-xs text-green-600 font-semibold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <p className="text-center text-gray-500">
          No plans available. Please contact support.
        </p>
      ) : (
        <div
          className={cn(
            "grid gap-8 max-w-7xl mx-auto",
            filteredPlans.length === 1
              ? "lg:grid-cols-1 max-w-md"
              : filteredPlans.length === 2
                ? "lg:grid-cols-2 max-w-3xl"
                : "lg:grid-cols-3"
          )}
        >
          {filteredPlans.map((plan, idx) => {
            const isPopular = idx === 1 && filteredPlans.length >= 3;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col relative",
                  isPopular
                    ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                    : ""
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.description || "Get started with this plan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-lg font-normal text-gray-500">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>

                  {plan.is_trial && plan.trial_days > 0 && (
                    <div className="mb-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md font-medium">
                      {plan.trial_days}-day free trial included
                    </div>
                  )}

                  <ul className="space-y-3">
                    {(plan.features || []).map((feature, fi) => (
                      <li key={fi} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.number_of_users > 0 && (
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                          {plan.number_of_users} user
                          {plan.number_of_users > 1 ? "s" : ""}
                        </span>
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/checkout?plan_id=${plan.id}`}
                    className="w-full"
                  >
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                    >
                      {plan.is_trial ? "Start Free Trial" : "Get Started"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
