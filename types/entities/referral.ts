export interface Referral {
  id: number
  user_id: number
  referral_code: string
  referred_user_id: number
  referred_user_email: string
  status: 'pending' | 'active' | 'credited'
  commission_amount: number
  commission_percentage: number
  created_at: string
  credited_at?: string
}

export interface ReferralStats {
  total_referrals: number
  active_referrals: number
  total_earnings: number
  pending_earnings: number
  available_balance: number
}

export interface WithdrawalRequest {
  id: number
  user_id: number
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  payment_method: string
  payment_details: Record<string, string>
  requested_at: string
  processed_at?: string
}
