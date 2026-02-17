"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { supportService, Ticket } from "@/services/support.service";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { Headset, Loader2, MessageSquare, Plus, RefreshCw, Ticket as TicketIcon, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { SupportTicketConversation } from "@/components/support/SupportTicketConversation";

export default function SupportTicketsPage() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { call, isLoading } = useApi();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "General",
    priority: "Medium",
    message: ""
  });

  const [selectedTicket, setSelectedQr] = useState<Ticket | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await supportService.getTickets(user.email);
      setTickets(data);
    } catch (error) {
      console.error(error);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.name || !user?.email) return;

    try {
      await call(() => supportService.createTicket({
        name: user.name,
        email: user.email,
        department: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message
      }));
      toast.success("Support ticket created");
      setIsCreateOpen(false);
      setNewTicket({ subject: "", category: "General", priority: "Medium", message: "" });
      fetchTickets();
    } catch (error) {
      toast.error("Failed to create ticket");
    }
  };

  const openTickets = tickets.filter(t => t.status !== "Resolved").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
            <Headset className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Support Desk</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Get help from our technical and billing experts
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTickets} disabled={isLoading} className="rounded-xl border-2">
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} /> Refresh
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle className="uppercase font-black tracking-tight">Open Support Ticket</DialogTitle>
                <DialogDescription className="uppercase font-bold text-[10px] tracking-widest">
                  Describe your issue and we'll get back to you soon
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Issue Subject</Label>
                  <Input
                    placeholder="Briefly describe the problem"
                    value={newTicket.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Category</Label>
                    <Select value={newTicket.category} onValueChange={v => setNewTicket({ ...newTicket, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General Inquiry</SelectItem>
                        <SelectItem value="Technical">Technical Support</SelectItem>
                        <SelectItem value="Billing">Billing Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={v => setNewTicket({ ...newTicket, priority: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Message Details</Label>
                  <Textarea
                    placeholder="Provide full details about your request..."
                    className="min-h-[150px] rounded-2xl"
                    value={newTicket.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTicket({ ...newTicket, message: e.target.value })}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full rounded-xl h-11 uppercase font-black tracking-widest text-[10px]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tickets", value: tickets.length, icon: TicketIcon, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Issues", value: openTickets, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Resolved", value: resolvedTickets, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[1.5rem] border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="text-2xl font-black tracking-tight">{stat.value}</div>
              </div>
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-2 overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="uppercase font-black text-lg">My Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Reference / Subject</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Category</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Last Activity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground uppercase font-bold text-[10px] tracking-widest">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "No support tickets found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="p-4">
                        <div className="font-bold text-sm truncate max-w-[200px]">{t.subject || "No Subject"}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{t.reference}</div>
                      </TableCell>
                      <TableCell className="p-4">
                        <span className="text-[10px] font-bold uppercase">{t.category}</span>
                      </TableCell>
                      <TableCell className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                          t.status === "Open" ? "bg-orange-50 text-orange-600 border-orange-100" :
                            t.status === "Resolved" ? "bg-green-50 text-green-600 border-green-100" :
                              "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {t.status}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-xs font-medium text-muted-foreground">
                        {new Date(t.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl border-2 text-[10px] font-black uppercase tracking-widest">
                              View Chat
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none">
                            <div className="p-6 border-b bg-card">
                              <DialogHeader>
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-50 rounded-xl">
                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <DialogTitle className="uppercase font-black tracking-tight">{t.reference}</DialogTitle>
                                    <DialogDescription className="font-bold text-sm text-foreground">{t.subject}</DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>
                            </div>
                            <div className="p-0">
                              <SupportTicketConversation
                                ticketId={t.id}
                                userEmail={user?.email || ""}
                                isClosed={t.status === "Resolved"}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
