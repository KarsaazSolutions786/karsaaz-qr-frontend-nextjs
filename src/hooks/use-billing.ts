"use client";

import { useCallback, useEffect, useState } from "react";
import billingService, { UserSubscription } from "@/services/billing.service";
import stripeService from "@/services/stripe.service";

interface BillingState {
  subscriptions: UserSubscription[];
  activeSubscription: UserSubscription | null;
  invoices: any[];
  paymentMethods: any[];
  loading: boolean;
}

export function useBilling() {
  const [state, setState] = useState<BillingState>({
    subscriptions: [],
    activeSubscription: null,
    invoices: [],
    paymentMethods: [],
    loading: true,
  });

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const [subRes, invoiceRes, pmRes] = await Promise.allSettled([
        billingService.getUserSubscriptions(),
        stripeService.getInvoices(),
        stripeService.getPaymentMethods(),
      ]);

      const subs: UserSubscription[] = [];
      if (subRes.status === "fulfilled") {
        const d = (subRes.value as any)?.data ?? subRes.value;
        if (Array.isArray(d)) subs.push(...d);
        else if (d?.data && Array.isArray(d.data)) subs.push(...d.data);
      }

      let invoices: any[] = [];
      if (invoiceRes.status === "fulfilled") {
        const d = (invoiceRes.value as any)?.data ?? invoiceRes.value;
        invoices = Array.isArray(d) ? d : d?.data ?? [];
      }

      let paymentMethods: any[] = [];
      if (pmRes.status === "fulfilled") {
        const d = (pmRes.value as any)?.data ?? pmRes.value;
        paymentMethods = Array.isArray(d) ? d : d?.data ?? [];
      }

      setState({
        subscriptions: subs,
        activeSubscription: subs.find((s) => s.status === "active") ?? null,
        invoices,
        paymentMethods,
        loading: false,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const cancelSubscription = useCallback(
    async (id: string | number) => {
      await billingService.cancelSubscription(id);
      await fetchAll();
    },
    [fetchAll]
  );

  return { ...state, refresh: fetchAll, cancelSubscription };
}

export default useBilling;
