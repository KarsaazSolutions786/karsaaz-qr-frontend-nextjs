"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { supportService, TicketMessage } from "@/services/support.service";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Headset } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SupportTicketConversationProps {
  ticketId: string;
  userEmail: string;
  isClosed?: boolean;
}

export function SupportTicketConversation({
  ticketId,
  userEmail,
  isClosed
}: SupportTicketConversationProps) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState("");
  const { call, isLoading } = useApi();
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await supportService.getConversation(ticketId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      const newMessage = await call(() => supportService.addMessage(ticketId, userEmail, reply));
      setMessages([...messages, newMessage]);
      setReply("");
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[500px] border-2 rounded-[2rem] overflow-hidden bg-muted/5">
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[80%] space-y-1",
                msg.author === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {msg.author === "user" ? "You" : "Support Team"}
                </span>
                {msg.author === "user" ? <User className="h-3 w-3 opacity-30" /> : <Headset className="h-3 w-3 text-blue-500" />}
              </div>
              <div 
                className={cn(
                  "p-4 rounded-2xl text-sm shadow-sm border",
                  msg.author === "user" 
                    ? "bg-blue-600 text-white border-blue-700 rounded-tr-none" 
                    : "bg-card border-gray-200 dark:border-zinc-800 rounded-tl-none"
                )}
              >
                {msg.body}
              </div>
              <span className="text-[8px] font-bold text-muted-foreground uppercase px-1">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {!isClosed ? (
        <form onSubmit={handleSend} className="p-4 bg-card border-t-2">
          <div className="flex gap-3">
            <Textarea 
              placeholder="Type your message here..." 
              className="rounded-xl min-h-[80px] resize-none"
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
            <Button 
              type="submit" 
              className="h-auto px-6 rounded-xl aspect-square" 
              disabled={isLoading || !reply.trim()}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-muted/30 border-t-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            This ticket is closed and read-only
          </p>
        </div>
      )}
    </div>
  );
}
