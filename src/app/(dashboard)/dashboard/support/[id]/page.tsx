"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import supportService from "@/services/support.service";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, Send, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface SupportMessage {
  id?: string | number;
  author: 'user' | 'admin' | 'support';
  body: string;
  timestamp?: string;
}

interface SupportTicket {
  id: string | number;
  subject: string;
  reference?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt?: string;
}

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConversation = useCallback(async () => {
    setLoading(true);
    try {
      const msgs = await supportService.getConversation(ticketId);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (_error: unknown) { // Use unknown for error
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const fetchTicketInfo = useCallback(async () => {
    if (!user?.email) return;
    try {
      const tickets = await supportService.getTickets(user.email);
      const found = (tickets as SupportTicket[]).find((t: SupportTicket) => t.id === ticketId || String(t.id) === ticketId);
      if (found) setTicket(found);
    } catch (_error: unknown) { /* silent */ } // Use unknown for error
  }, [user?.email, ticketId]);

  useEffect(() => {
    fetchConversation();
    if (user?.email) fetchTicketInfo();
  }, [ticketId, user?.email, fetchConversation, fetchTicketInfo]); // Add fetchConversation, fetchTicketInfo to dependencies

  // Scroll to bottom when messages load
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !user?.email) return;
    setSending(true);
    try {
      const newMsg: SupportMessage = await supportService.addMessage(ticketId, user.email, reply.trim());
      setMessages(prev => [...prev, newMsg]);
      setReply("");
    } catch (_error: unknown) { toast.error("Failed to send message"); }
    finally { setSending(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link href="/dashboard/support"
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </Link>

      <Card className="flex flex-col" style={{ height: "calc(100vh - 180px)", minHeight: 500 }}>
        <CardHeader className="border-b py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{ticket?.subject ?? `Ticket #${ticketId}`}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ticket?.reference ?? `#${ticketId}`}
                {ticket?.status && (
                  <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    ticket.status === "Open" ? "bg-orange-100 text-orange-700" :
                      ticket.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                  )}>
                    {ticket.status}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No messages yet.
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg.id ?? i}
                className={cn("flex items-start space-x-3", msg.author === "user" ? "flex-row-reverse space-x-reverse" : "flex-row")}>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  msg.author === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <User className="h-4 w-4" />
                </div>
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                  msg.author === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <p>{msg.body}</p>
                  <p className={cn("text-[10px] mt-1 opacity-70")}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="border-t p-3">
          <form className="flex w-full items-center gap-2" onSubmit={handleSend}>
            <input
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Type your reply..."
              value={reply}
              onChange={e => setReply(e.target.value)}
              disabled={sending || ticket?.status === "Resolved"}
            />
            <Button type="submit" size="icon" disabled={sending || !reply.trim() || ticket?.status === "Resolved"}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          {ticket?.status === "Resolved" && (
            <p className="text-xs text-muted-foreground ml-2">This ticket is resolved and closed.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
