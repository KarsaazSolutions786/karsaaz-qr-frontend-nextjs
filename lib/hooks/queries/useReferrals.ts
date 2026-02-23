import { useQuery } from '@tanstack/react-query'
import { referralAPI } from '@/lib/api/endpoints/referral'
import { queryKeys } from '@/lib/query/keys'

// List referred users with pagination
export function useReferrals(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.referrals.list(params),
    queryFn: () => referralAPI.list(params),
    staleTime: 30000,
  })
}

// Get referral statistics
export function useReferralStats() {
  return useQuery({
    queryKey: queryKeys.referrals.stats(),
    queryFn: () => referralAPI.getStats(),
    staleTime: 30000,
  })
}

// Get user's referral code
export function useReferralCode() {
  return useQuery({
    queryKey: queryKeys.referrals.code(),
    queryFn: () => referralAPI.getCode(),
    staleTime: 5 * 60 * 1000, // Referral code rarely changes
  })
}
