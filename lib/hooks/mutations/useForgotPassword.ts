'use client'

import { useMutation } from '@tanstack/react-query'
import { authAPI, ForgotPasswordRequest } from '@/lib/api/endpoints/auth'

/**
 * Purpose: Executes useForgotPassword functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
  })
}
