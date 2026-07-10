import { useQuery } from '@tanstack/react-query'
import { rpc, rpcBatch } from '@/lib/api/rpc'
import { referralAPI } from '@/lib/api/endpoints/referral'
import { queryKeys } from '@/lib/query/keys'
import type { ReferralStats } from '@/types/entities/referral'


export function useReferrals(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.referrals.list(params),
    queryFn: () => referralAPI.list(params),
    staleTime: 30000,
  })
}

export function useReferralStats() {
  return useQuery<ReferralStats>({
    queryKey: queryKeys.referrals.stats(),
    queryFn: async ({ signal }) => {
      const results = await rpcBatch(
        [{ method: 'referral.stats' }, { method: 'referral.commissionSummary' }],
        { signal }
      )
      const stats = results.get('referral.stats')?.result as Record<string, number> | null
      const commission = results.get('referral.commissionSummary')?.result as Record<string, number> | null

      return {
        total_referrals: stats?.total_referrals ?? 0,
        active_referrals: stats?.active_referrals ?? 0,
        total_earnings: stats?.total_earnings ?? 0,
        pending_earnings: stats?.pending_earnings ?? 0,
        available_balance: commission?.available_balance ?? 0,
      }
    },
    staleTime: 30000,
  })
}

export function useReferralCode() {
  return useQuery<{ referral_code: string }>({
    queryKey: queryKeys.referrals.code(),
    queryFn: async ({ signal }) => {
      const result = await rpc<{ referral_code: string }>(
        'referral.stats',
        {},
        { signal }
      )
      return { referral_code: result.referral_code ?? '' }
    },
    staleTime: 5 * 60 * 1000,
  })
}
