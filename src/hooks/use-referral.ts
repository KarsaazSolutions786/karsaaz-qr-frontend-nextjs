"use client";

import { useCallback, useEffect, useState } from "react";
import commissionService from "@/services/commission.service";

interface ReferralState {
  dashboard: any | null;
  withdrawalSummary: any | null;
  commissions: any[];
  withdrawals: any[];
  loading: boolean;
}

export function useReferral() {
  const [state, setState] = useState<ReferralState>({
    dashboard: null,
    withdrawalSummary: null,
    commissions: [],
    withdrawals: [],
    loading: true,
  });

  const fetchAll = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const [dashRes, summaryRes, historyRes, wdRes] = await Promise.allSettled([
        commissionService.getDashboard(),
        commissionService.getWithdrawalSummary(),
        commissionService.getHistory(),
        commissionService.getWithdrawalHistory(),
      ]);

      setState({
        dashboard:
          dashRes.status === "fulfilled"
            ? (dashRes.value as any)?.data ?? dashRes.value
            : null,
        withdrawalSummary:
          summaryRes.status === "fulfilled"
            ? (summaryRes.value as any)?.data ?? summaryRes.value
            : null,
        commissions: (() => {
          if (historyRes.status !== "fulfilled") return [];
          const d = (historyRes.value as any)?.data ?? historyRes.value;
          return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        })(),
        withdrawals: (() => {
          if (wdRes.status !== "fulfilled") return [];
          const d = (wdRes.value as any)?.data ?? wdRes.value;
          return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        })(),
        loading: false,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const claimCommissions = useCallback(async () => {
    await commissionService.claimCommissions();
    await fetchAll();
  }, [fetchAll]);

  const requestWithdrawal = useCallback(
    async (data: { amount: number; payment_method: string; payment_details?: string }) => {
      await commissionService.createWithdrawal(data);
      await fetchAll();
    },
    [fetchAll]
  );

  return { ...state, refresh: fetchAll, claimCommissions, requestWithdrawal };
}

export default useReferral;
