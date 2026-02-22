// Support API Client Service (T019)
// Per research.md R8 and contracts/support-tickets.yaml
// External CRM: https://crmapp.karsaazebs.com/api/support

import axios from 'axios';

const SUPPORT_BASE_URL = 'https://crmapp.karsaazebs.com/api/support';
const PRODUCT_ID = 2; // Karsaaz QR

const supportClient = axios.create({
  baseURL: SUPPORT_BASE_URL,
  timeout: 60000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export interface CreateTicketPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  department: 'Technical' | 'Billing';
}

const PRIORITY_MAP: Record<string, string> = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
  Urgent: 'HIGH',
};

const DEPARTMENT_MAP: Record<string, string> = {
  Technical: 'TECHNICAL',
  Billing: 'BILLING',
};

class SupportAPI {
  private static instance: SupportAPI;

  static getInstance(): SupportAPI {
    if (!this.instance) this.instance = new SupportAPI();
    return this.instance;
  }

  /** Create a new support ticket */
  async createTicket(payload: CreateTicketPayload) {
    const response = await supportClient.post('/tickets', {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      priority: PRIORITY_MAP[payload.priority] || 'MEDIUM',
      department: DEPARTMENT_MAP[payload.department] || 'TECHNICAL',
      product_id: PRODUCT_ID,
    });
    return response.data;
  }

  /** Get all tickets for a user by email */
  async getUserTickets(email: string) {
    const response = await supportClient.get('/tickets/user', {
      params: { email, productId: PRODUCT_ID },
    });
    return response.data;
  }

  /** Get ticket conversation messages */
  async getConversation(ticketId: number) {
    const response = await supportClient.get(`/tickets/${ticketId}/conversation`);
    return response.data;
  }

  /** Reply to a ticket */
  async addUserMessage(ticketId: number, email: string, text: string) {
    const response = await supportClient.post(`/tickets/${ticketId}/messages/user`, {
      email,
      text,
    });
    return response.data;
  }
}

export const supportAPI = SupportAPI.getInstance();
