import { useQuery } from '@tanstack/react-query'
import { supportTicketsAPI } from '@/lib/api/endpoints/support-tickets'
import { queryKeys } from '@/lib/query/keys'

// List tickets for a user
export function useSupportTickets(email: string) {
  return useQuery({
    queryKey: queryKeys.support.tickets(),
    queryFn: () => supportTicketsAPI.list(email),
    enabled: !!email,
    staleTime: 30000,
  })
}

// Get conversation for a ticket
export function useSupportTicket(ticketId: number) {
  return useQuery({
    queryKey: queryKeys.support.ticket(String(ticketId)),
    queryFn: () => supportTicketsAPI.getConversation(ticketId),
    enabled: !!ticketId,
  })
}
