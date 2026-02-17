"use client";

import { useCallback, useEffect, useState } from "react";
import supportService, { Ticket } from "@/services/support.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useSupport() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await supportService.getTickets(user.email);
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) fetchTickets();
  }, [user?.email, fetchTickets]);

  const createTicket = useCallback(
    async (data: { priority: string; department: string; message: string }) => {
      if (!user?.email || !user?.name) throw new Error("User not authenticated");
      const ticket = await supportService.createTicket({
        name: user.name,
        email: user.email,
        ...data,
      });
      await fetchTickets();
      return ticket;
    },
    [user, fetchTickets]
  );

  const addMessage = useCallback(
    async (ticketId: string, text: string) => {
      if (!user?.email) throw new Error("User not authenticated");
      return supportService.addMessage(ticketId, user.email, text);
    },
    [user?.email]
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  return { tickets, loading, stats, refresh: fetchTickets, createTicket, addMessage };
}

export default useSupport;
