import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import { queryKeys } from '@/lib/query/keys'
import type { CreateTicketPayload } from '@/types/entities/support-ticket'

export function useCreateSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTicketPayload) => supportTicketsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.tickets() })
    },
  })
}

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
