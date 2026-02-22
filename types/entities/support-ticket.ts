// Support Ticket Entity Types (T055)

export interface SupportTicket {
  id: number
  reference: string
  name: string
  email: string
  subject: string
  message: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  department: 'TECHNICAL' | 'BILLING'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  product_id: number
  created_at: string
  updated_at: string
  first_response_at?: string
}

export interface TicketMessage {
  id: number
  ticket_id: number
  sender_type: 'user' | 'agent'
  sender_name: string
  message: string
  created_at: string
}

export interface CreateTicketPayload {
  name: string
  email: string
  subject: string
  message: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  department: 'Technical' | 'Billing'
}
