// Support Tickets API Endpoint (T056)
// Wrapper around supportAPI service for consistent endpoint pattern

import { supportAPI } from '@/lib/services/support-api'
import type { CreateTicketPayload, SupportTicket, TicketMessage } from '@/types/entities/support-ticket'

export const supportTicketsAPI = {
  create: async (data: CreateTicketPayload): Promise<SupportTicket> => {
    const response = await supportAPI.createTicket(data)
    return response
  },

  list: async (email: string): Promise<SupportTicket[]> => {
    const response = await supportAPI.getUserTickets(email)
    return response
  },

  getConversation: async (ticketId: number): Promise<TicketMessage[]> => {
    const response = await supportAPI.getConversation(ticketId)
    return response
  },

  reply: async (ticketId: number, email: string, text: string): Promise<TicketMessage> => {
    const response = await supportAPI.addUserMessage(ticketId, email, text)
    return response
  },
}
