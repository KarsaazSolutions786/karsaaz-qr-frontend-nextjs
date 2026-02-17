"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import transactionService from "@/services/transaction.service";
import { CheckCircle, Eye, Loader2, Receipt, RefreshCw, Search, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Transaction {
  id: string | number;
  user_id: string | number;
  user?: { name?: string; email?: string };
  amount: number;
  currency?: string;
  type: string;
  payment_processor?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  external_id?: string;
  created_at?: string;
  proof_of_payment?: string;
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  failed:    "bg-red-100 text-red-700",
  refunded:  "bg-blue-100 text-blue-700",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState<Transaction | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionDialog, setActionDialog] = useState<"approve" | "reject" | "view" | null>(null);
  const { call, isLoading: actionLoading } = useApi();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAll({ page, search: search || undefined });
      const data = (res as { data?: { data?: Transaction[]; total?: number } })?.data ?? res;
      setTransactions(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      setTotal(data?.total ?? 0);
    } catch (_error: unknown) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const openAction = (tx: Transaction, action: "approve" | "reject" | "view") => {
    setSelected(tx);
    setRejectReason("");
    setActionDialog(action);
  };

  const handleApprove = async () => {
    if (!selected) return;
    try {
      await call(() => transactionService.approve(selected.id));
      toast.success("Transaction approved");
      setActionDialog(null);
      fetchTransactions();
    } catch { toast.error("Failed to approve transaction"); }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      await call(() => transactionService.reject(selected.id, rejectReason));
      toast.success("Transaction rejected");
      setActionDialog(null);
      fetchTransactions();
    } catch { toast.error("Failed to reject transaction"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Transactions
          </h1>
          <p className="text-sm text-muted-foreground">View and manage all payment transactions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-8 h-9" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                  <tr>
                    {["ID", "User", "Amount", "Type", "Payment Method", "Status", "Date", "Actions"].map(h => (
                      <th key={h} className="p-4 font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted-foreground">#{tx.id}</td>
                      <td className="p-4 text-sm">{tx.user?.name ?? tx.user_id}</td>
                      <td className="p-4 font-medium">
                        {tx.currency ?? "$"}{typeof tx.amount === "number" ? tx.amount.toFixed(2) : tx.amount}
                      </td>
                      <td className="p-4 text-xs capitalize">{tx.type ?? "—"}</td>
                      <td className="p-4 text-xs capitalize">{tx.payment_processor ?? "manual"}</td>
                      <td className="p-4">
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", STATUS_STYLES[tx.status] ?? "bg-gray-100 text-gray-600")}>
                          {tx.status ?? "unknown"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openAction(tx, "view")} title="View details">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {tx.status === "pending" && (
                            <>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => openAction(tx, "approve")} title="Approve">
                                <CheckCircle className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => openAction(tx, "reject")} title="Reject">
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === "approve"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Transaction</DialogTitle>
          <DialogDescription>
            Approve transaction #{selected?.id} of {selected?.currency}{selected?.amount}?
            This will activate the associated subscription.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
          <Button onClick={handleApprove} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog === "reject"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Transaction</DialogTitle>
          <DialogDescription>Provide a reason for rejecting transaction #{selected?.id}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input placeholder="Reason for rejection (optional)" value={rejectReason}
            onChange={e => setRejectReason(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={actionDialog === "view"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction #{selected?.id}</DialogTitle>
        </DialogHeader>
        {selected && (
          <div className="py-4 space-y-3 text-sm">
            {[
              ["User", selected.user?.name ?? selected.user_id],
              ["Amount", `${selected.currency ?? ""}${selected.amount}`],
              ["Type", selected.type],
              ["Payment Method", selected.payment_processor ?? "manual"],
              ["Status", selected.status],
              ["External ID", selected.external_id ?? "—"],
              ["Created", selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium capitalize">{value ?? "—"}</span>
              </div>
            ))}
            {selected.proof_of_payment && (
              <a href={selected.proof_of_payment} target="_blank" rel="noreferrer"
                className="text-blue-600 hover:underline text-xs">
                View Proof of Payment
              </a>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setActionDialog(null)}>Close</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
