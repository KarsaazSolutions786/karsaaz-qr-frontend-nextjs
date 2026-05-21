import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import { queryKeys } from '@/lib/query/keys'
import type { CreateTicketPayload } from '@/types/entities/support-ticket'

/**
 * Purpose: Executes useCreateSupportTicket functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTicketPayload) => supportTicketsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.tickets() })
    },
  })
}

/**
 * Purpose: Executes useReplySupportTicket functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useReplySupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ticketId, email, text }: { ticketId: number; email: string; text: string }) =>
      supportTicketsAPI.reply(ticketId, email, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.support.ticket(String(variables.ticketId)),
      })
    },
  })
}
