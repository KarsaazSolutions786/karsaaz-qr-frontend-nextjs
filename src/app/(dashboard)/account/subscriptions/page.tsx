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
import billingService, { UserSubscription } from "@/services/billing.service";
import {
  ArrowUpCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  PauseCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  active: { icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-100 text-green-700", label: "Active" },
  canceled: { icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-700", label: "Canceled" },
  expired: { icon: <Clock className="w-4 h-4" />, color: "bg-gray-100 text-gray-700", label: "Expired" },
  pending_payment: { icon: <PauseCircle className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-700", label: "Pending" },
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | number | null>(null);

  const fetchSubscriptions = React.useCallback(async () => {
    try {
      const res = await billingService.getUserSubscriptions();
      const data = res.data ?? res;
      setSubscriptions(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: unknown) { // Use unknown for err
      console.error("Failed to load subscriptions", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as billingService is stable

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancel = async (id: string | number) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    setCanceling(id);
    try {
      await billingService.cancelSubscription(id);
      toast.success("Subscription canceled");
      fetchSubscriptions();
    } catch (err: unknown) { // Use unknown for err
      const apiError = err as { message?: string }; // Type assertion for message
      toast.error(apiError?.message || "Failed to cancel subscription");
    } finally {
      setCanceling(null);
    }
  };

  const getRemainingDays = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeSub = subscriptions.find((s) => s.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <Link href="/pricing">
          <Button>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            {activeSub ? "Change Plan" : "Subscribe"}
          </Button>
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to a plan to start creating QR codes.
            </p>
            <Link href="/pricing">
              <Button>View Plans</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        subscriptions.map((sub) => {
          const plan = sub.subscription_plan;
          const status = statusConfig[sub.status] || statusConfig.expired;
          const remaining = sub.expires_at ? getRemainingDays(sub.expires_at) : null;

          return (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{plan?.name || "Subscription"}</CardTitle>
                    <CardDescription>
                      {plan?.description || "Your current plan"}
                    </CardDescription>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                      status.color
                    )}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {plan?.price !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: plan?.currency || "USD",
                          minimumFractionDigits: 0,
                        }).format(plan.price)}
                        /{plan?.frequency === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                  )}
                  {sub.expires_at && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Expires</span>
                      <span className="font-medium">
                        {new Date(sub.expires_at).toLocaleDateString()}
                        {remaining !== null && remaining > 0 && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({remaining} days left)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {sub.trial_ends_at && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Trial Ends</span>
                      <span className="font-medium">
                        {new Date(sub.trial_ends_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Started</span>
                    <span className="font-medium">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Plan Features */}
                {plan?.features && plan.features.length > 0 && (
                  <div className="pt-3">
                    <h4 className="text-sm font-medium mb-2">Plan Features:</h4>
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {plan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {sub.status === "active" && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleCancel(sub.id)}
                    disabled={canceling === sub.id}
                  >
                    {canceling === sub.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cancel Subscription
                  </Button>
                )}
                {sub.status === "canceled" && (
                  <span className="text-sm text-muted-foreground">
                    Subscription canceled
                  </span>
                )}
                <Link href="/pricing">
                  <Button variant="outline">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Upgrade
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
}
