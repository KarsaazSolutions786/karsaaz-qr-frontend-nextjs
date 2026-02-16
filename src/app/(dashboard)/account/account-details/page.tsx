"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import billingService, { UserSubscription } from "@/services/billing.service";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowUpCircle,
  CheckCircle,
  Loader2,
  QrCode,
  ScanLine,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountDetailsPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const [subRes, balRes] = await Promise.all([
          billingService.getUserSubscriptions(),
          user?.id ? userService.getAccountBalance(user.id).catch(() => null) : Promise.resolve(null),
        ]);

        const subData = subRes.data ?? subRes;
        const subs = Array.isArray(subData) ? subData : subData.data ?? [];
        const activeSub = subs.find((s: UserSubscription) => s.status === "active") || subs[0] || null;
        setSubscription(activeSub);

        if (balRes) {
          const balData = balRes.data ?? balRes;
          setBalance(typeof balData === "number" ? balData : balData?.balance ?? null);
        }
      } catch (err) {
        console.error("Failed to load account details", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const plan = subscription?.subscription_plan;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Details</h1>
        <Link href="/pricing">
          <Button>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            {plan ? "Change Plan" : "Subscribe"}
          </Button>
        </Link>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            {plan ? `You're on the ${plan.name} plan` : "No active plan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plan ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <QrCode className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">QR Code Types</p>
                    <p className="font-bold">
                      {plan.qr_types?.length || "Unlimited"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <ScanLine className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-bold capitalize">
                      {plan.frequency || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="font-bold">{plan.number_of_users || 1}</p>
                  </div>
                </div>
                {balance !== null && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Wallet className="h-8 w-8 text-amber-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: plan.currency || "USD",
                        }).format(balance)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Features */}
              {plan.features && plan.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Plan Features</h4>
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

              {/* Allowed QR Types */}
              {plan.qr_types && plan.qr_types.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Allowed QR Types ({plan.qr_types.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.qr_types.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {t.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                No active subscription. Subscribe to unlock features.
              </p>
              <Link href="/pricing">
                <Button>View Plans</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
