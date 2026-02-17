"use client";

import { useCallback, useEffect, useState } from "react";
import billingService, { UserSubscription } from "@/services/billing.service";
import billingManagementService, {
  type CurrentPlan,
  type UsageMetrics,
  type BillingAddress,
} from "@/services/billing-management.service";
import invoiceService, { type Invoice } from "@/services/invoice.service";
import paymentMethodService, { type PaymentMethod } from "@/services/payment-method.service";
import stripeService from "@/services/stripe.service";

interface BillingState {
  subscriptions: UserSubscription[];
  activeSubscription: UserSubscription | null;
  currentPlan: CurrentPlan | null;
  usageMetrics: UsageMetrics | null;
  billingAddress: BillingAddress | null;
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

export function useBilling() {
  const [state, setState] = useState<BillingState>({
    subscriptions: [],
    activeSubscription: null,
    currentPlan: null,
    usageMetrics: null,
    billingAddress: null,
    invoices: [],
    paymentMethods: [],
    loading: true,
    error: null,
  });

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [
        subRes,
        planRes,
        usageRes,
        addressRes,
        invoiceRes,
        pmRes,
      ] = await Promise.allSettled([
        billingService.getUserSubscriptions(),
        billingManagementService.getCurrentPlan(),
        billingManagementService.getUsageMetrics(),
        billingManagementService.getBillingAddress(),
        invoiceService.listInvoices(1, 50),
        paymentMethodService.listPaymentMethods(),
      ]);

      // Process subscriptions
      const subs: UserSubscription[] = [];
      if (subRes.status === "fulfilled") {
        const d = (subRes.value as any)?.data ?? subRes.value;
        if (Array.isArray(d)) subs.push(...d);
        else if (d?.data && Array.isArray(d.data)) subs.push(...d.data);
      }

      // Process current plan
      let currentPlan: CurrentPlan | null = null;
      if (planRes.status === "fulfilled") {
        currentPlan = (planRes.value as any)?.data ?? null;
      }

      // Process usage metrics
      let usageMetrics: UsageMetrics | null = null;
      if (usageRes.status === "fulfilled") {
        usageMetrics = (usageRes.value as any)?.data ?? null;
      }

      // Process billing address
      let billingAddress: BillingAddress | null = null;
      if (addressRes.status === "fulfilled") {
        billingAddress = (addressRes.value as any)?.data ?? null;
      }

      // Process invoices
      let invoices: Invoice[] = [];
      if (invoiceRes.status === "fulfilled") {
        const d = (invoiceRes.value as any)?.data ?? invoiceRes.value;
        invoices = Array.isArray(d) ? d : d?.data ?? [];
      }

      // Process payment methods
      let paymentMethods: PaymentMethod[] = [];
      if (pmRes.status === "fulfilled") {
        const d = (pmRes.value as any)?.data ?? pmRes.value;
        paymentMethods = Array.isArray(d) ? d : d?.data ?? [];
      }

      setState({
        subscriptions: subs,
        activeSubscription: subs.find((s) => s.status === "active") ?? null,
        currentPlan,
        usageMetrics,
        billingAddress,
        invoices,
        paymentMethods,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch billing data",
      }));
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
