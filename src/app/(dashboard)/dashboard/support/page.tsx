"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import supportService from "@/services/support.service";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const CATEGORY_OPTIONS = ["General", "Technical", "Billing"];

const STATUS_STYLES: Record<string, string> = {
  Open:        "bg-orange-100 text-orange-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved:    "bg-green-100 text-green-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High:   "bg-red-50 text-red-600",
  Medium: "bg-yellow-100 text-yellow-700",
  Low:    "bg-gray-100 text-gray-600",
};

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  const [newDialog, setNewDialog] = useState(false);
  const [form, setForm]           = useState({ subject: "", priority: "Medium", department: "General", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
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
  };

  useEffect(() => { if (user?.email) fetchTickets(); }, [user?.email]);

  const handleCreateTicket = async () => {
    if (!form.message.trim() || !user) return;
    setSubmitting(true);
    try {
      await supportService.createTicket({
        name: user.name ?? user.email,
        email: user.email,
        priority: form.priority,
        department: form.department,
        message: form.message,
      });
      toast.success("Support ticket created successfully");
      setNewDialog(false);
      setForm({ subject: "", priority: "Medium", department: "General", message: "" });
      fetchTickets();
    } catch { toast.error("Failed to create ticket. Please try again."); }
    finally { setSubmitting(false); }
  };

  const filtered = tickets.filter(t =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.reference?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    open:       tickets.filter(t => t.status === "Open").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    resolved:   tickets.filter(t => t.status === "Resolved").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground text-sm">Get help with your account and QR codes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setNewDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Open</span>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{loading ? "—" : stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{loading ? "—" : stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Resolved</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{loading ? "—" : stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              {tickets.length === 0 ? "No support tickets yet. Create one to get started." : "No tickets match your search."}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(ticket => (
                <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block group">
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-muted/40 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary">{ticket.subject}</h4>
                        <p className="text-xs text-muted-foreground">
                          {ticket.reference} · {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", PRIORITY_STYLES[ticket.priority] ?? "bg-gray-100 text-gray-600")}>
                        {ticket.priority}
                      </span>
                      <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full", STATUS_STYLES[ticket.status] ?? "bg-gray-100 text-gray-600")}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Ticket Dialog */}
      <Dialog open={newDialog} onClose={() => setNewDialog(false)}>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>Describe your issue and our team will get back to you shortly.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ticket-message">Describe Your Issue</Label>
            <textarea
              id="ticket-message"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Please describe your issue in detail..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setNewDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTicket} disabled={submitting || !form.message.trim()}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Ticket
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
