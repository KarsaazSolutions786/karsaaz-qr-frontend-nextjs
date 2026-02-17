"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import stripeService from "@/services/stripe.service";
import {
  CreditCard,
  Loader2,
  Star,
  Trash2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default?: boolean;
}

const brandIcons: Record<string, string> = {
  visa: "💳 Visa",
  mastercard: "💳 Mastercard",
  amex: "💳 Amex",
  discover: "💳 Discover",
  jcb: "💳 JCB",
  unionpay: "💳 UnionPay",
};

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const fetchMethods = React.useCallback(async () => {
    try {
      const res = await stripeService.getPaymentMethods();
      const data = res.data ?? res;
      setMethods(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: unknown) {
      console.error("Failed to load payment methods", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    setDeletingId(id);
    try {
      await stripeService.deletePaymentMethod(id);
      toast.success("Payment method removed");
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      toast.error(apiError?.message || "Failed to remove payment method");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    try {
      await stripeService.setDefaultPaymentMethod(id);
      toast.success("Default payment method updated");
      setMethods((prev) =>
        prev.map((m) => ({ ...m, is_default: m.id === id }))
      );
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      toast.error(apiError?.message || "Failed to update default");
    } finally {
      setSettingDefaultId(null);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
      </div>

      {methods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground">
              Payment methods are added during checkout.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={cn(
                method.is_default ? "ring-2 ring-primary/30 border-primary" : ""
              )}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {brandIcons[method.brand] || `💳 ${method.brand}`} ending
                      in {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.exp_month}/{method.exp_year}
                    </p>
                  </div>
                  {method.is_default && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3" /> Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!method.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={settingDefaultId === method.id}
                    >
                      {settingDefaultId === method.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Set Default"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(method.id)}
                    disabled={deletingId === method.id}
                  >
                    {deletingId === method.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
