/**
 * Support Ticket Service
 * CRM-integrated support ticket system.
 * Uses CRM API at crmapp.karsaazebs.com
 */
import crmClient from '@/lib/crm-client';

const PRODUCT_ID = '2'; // Karsaaz QR Product ID in CRM

export interface Ticket {
  id: string;
  reference: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  author: 'user' | 'support';
  body: string;
  timestamp: string;
}

// ─── Mappers ─────────────────────────────────────────────

const mapPriorityToBackend = (priority: string) => {
  switch (priority) {
    case 'Low': return 'LOW';
    case 'Medium': return 'MEDIUM';
    case 'High':
    case 'Urgent': return 'HIGH';
    default: return 'MEDIUM';
  }
};

const mapPriorityFromBackend = (priority: string) => {
  switch (priority) {
    case 'LOW': return 'Low';
    case 'MEDIUM': return 'Medium';
    case 'HIGH': return 'High';
    default: return 'Medium';
  }
};

const mapStatusFromBackend = (status: string) => {
  switch (status) {
    case 'OPEN': return 'Open';
    case 'IN_PROGRESS': return 'In Progress';
    case 'RESOLVED': return 'Resolved';
    default: return 'Open';
  }
};

const mapDepartmentFromBackend = (department: string) => {
  switch (department) {
    case 'SALES': return 'General';
    case 'TECHNICAL': return 'Technical';
    case 'BILLING': return 'Billing';
    default: return 'General';
  }
};

const mapDepartmentToBackend = (category: string) => {
  switch (category) {
    case 'Billing': return 'BILLING';
    case 'General': return 'SALES';
    default: return 'TECHNICAL';
  }
};

const mapTicketFromBackend = (ticket: any): Ticket => ({
  id: ticket.id.toString(),
  reference: `TCK-${new Date(ticket.createdAt).getFullYear()}-${ticket.id.toString().padStart(4, '0')}`,
  subject: ticket.initialMessage?.slice(0, 50) + (ticket.initialMessage?.length > 50 ? '...' : ''),
  category: mapDepartmentFromBackend(ticket.department),
  priority: mapPriorityFromBackend(ticket.priority),
  status: mapStatusFromBackend(ticket.status),
  requesterName: ticket.name,
  requesterEmail: ticket.email,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
  messages: [],
});

// ─── Service ─────────────────────────────────────────────

export const supportService = {
  /** GET /support/tickets/user?email=&productId= — Get user's tickets */
  getTickets: async (email: string) => {
    const response: any = await crmClient.get(
      `/support/tickets/user`,
      { email, productId: PRODUCT_ID }
    );
    if (!response?.success) return [];
    return response.data.map(mapTicketFromBackend);
  },

  /** GET /support/tickets/{id}/conversation — Get ticket messages */
  getConversation: async (ticketId: string) => {
    const response: any = await crmClient.get(`/support/tickets/${ticketId}/conversation`);
    if (!response?.success) return [];
    return response.data.map((msg: any) => ({
      id: msg.id.toString(),
      author: msg.senderType === 'USER' ? 'user' : 'support',
      body: msg.messageText,
      timestamp: msg.createdAt,
    }));
  },

  /** POST /support/tickets — Create ticket (FormData) */
  createTicket: async (data: {
    name: string;
    email: string;
    priority: string;
    department: string;
    message: string;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('priority', mapPriorityToBackend(data.priority));
    formData.append('department', mapDepartmentToBackend(data.department));
    formData.append('message', data.message);
    formData.append('productName', 'Karsaaz QR');

    const response: any = await crmClient.post('/support/tickets', formData);
    if (!response?.success) throw new Error(response?.message || 'Failed to create ticket');
    return mapTicketFromBackend(response.data);
  },

  /** POST /support/tickets/{id}/messages/user — Reply to ticket */
  addMessage: async (ticketId: string, email: string, text: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('text', text);

    const response: any = await crmClient.post(
      `/support/tickets/${ticketId}/messages/user`,
      formData
    );
    if (!response?.success) throw new Error(response?.message || 'Failed to add message');

    return {
      id: response.data.id.toString(),
      author: response.data.senderType === 'USER' ? 'user' : 'support' as const,
      body: response.data.messageText,
      timestamp: response.data.createdAt,
    };
  },
};

export default supportService;
