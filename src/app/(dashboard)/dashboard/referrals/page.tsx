"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import commissionService from "@/services/commission.service";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  DollarSign,
  Loader2,
  RefreshCw,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CommissionDashboard {
  total_referrals?: number;
  referred_count?: number;
  total_earned?: number;
  unclaimed_amount?: number;
  commission_rate?: string;
  rate?: string;
  referral_link?: string;
  referral_url?: string;
}

interface WithdrawalSummary {
  available_balance?: number;
}

interface Commission {
  id: string | number;
  amount: number;
  currency?: string;
  status: string;
  created_at: string;
}

interface Withdrawal {
  id: string | number;
  amount: number;
  currency?: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

export default function ReferralPage() {
  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
  };

  const [tab, setTab]= useState<"overview" | "history" | "withdrawals">("overview");

  const [dashboard, setDashboard]   = useState<CommissionDashboard | null>(null);
  const [summary, setSummary]       = useState<WithdrawalSummary | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawDetails, setWithdrawDetails] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, summaryRes, historyRes, wdRes] = await Promise.allSettled([
        commissionService.getDashboard(),
        commissionService.getWithdrawalSummary(),
        commissionService.getHistory(),
        commissionService.getWithdrawalHistory(),
      ]);
      if (dashRes.status === "fulfilled") setDashboard((dashRes.value as { data?: CommissionDashboard })?.data ?? dashRes.value);
      if (summaryRes.status === "fulfilled") setSummary((summaryRes.value as { data?: WithdrawalSummary })?.data ?? summaryRes.value);
      if (historyRes.status === "fulfilled") {
        const d = (historyRes.value as { data?: { data?: Commission[] } })?.data ?? historyRes.value;
        setCommissions(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }
      if (wdRes.status === "fulfilled") {
        const d = (wdRes.value as { data?: { data?: Withdrawal[] } })?.data ?? wdRes.value;
        setWithdrawals(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies for useCallback. Assuming commissionService methods are stable.

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleClaimCommissions = async () => {
    setActionLoading(true);
    try {
      await commissionService.claimCommissions();
      toast.success("Commissions claimed successfully");
      fetchData();
    } catch { toast.error("Failed to claim commissions"); }
    finally { setActionLoading(false); }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) return;
    setActionLoading(true);
    try {
      await commissionService.createWithdrawal({
        amount: parseFloat(withdrawAmount),
        payment_method: withdrawMethod,
        payment_details: withdrawDetails || undefined,
      });
      toast.success("Withdrawal request submitted");
      setWithdrawDialog(false);
      setWithdrawAmount(""); setWithdrawMethod(""); setWithdrawDetails("");
      fetchData();
    } catch { toast.error("Failed to submit withdrawal request"); }
    finally { setActionLoading(false); }
  };

  const copyReferralLink = () => {
    const link = dashboard?.referral_link ?? dashboard?.referral_url;
    if (!link) { toast.error("Referral link not available"); return; }
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard");
  };

  const statsCards = [
    { label: "Total Referrals", value: dashboard?.total_referrals ?? dashboard?.referred_count ?? "—", icon: Users, color: "text-blue-500" },
    { label: "Total Earned", value: dashboard?.total_earned != null ? `$${Number(dashboard.total_earned).toFixed(2)}` : "—", icon: DollarSign, color: "text-green-500" },
    { label: "Unclaimed", value: dashboard?.unclaimed_amount != null ? `$${Number(dashboard.unclaimed_amount).toFixed(2)}` : "—", icon: ArrowUpRight, color: "text-orange-500" },
    { label: "Available Balance", value: summary?.available_balance != null ? `$${Number(summary.available_balance).toFixed(2)}` : "—", icon: Wallet, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Referral & Commissions</h1>
          <p className="text-muted-foreground text-sm">Invite friends and earn commissions on their subscriptions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statsCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-xl font-bold">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn commissions when people subscribe.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={dashboard?.referral_link ?? dashboard?.referral_url ?? "Loading..."}
              className="font-mono text-xs"
            />
            <Button variant="outline" size="icon" onClick={copyReferralLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b flex gap-0">
        {(["overview", "history", "withdrawals"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Unclaimed Commissions</CardTitle>
              {(dashboard?.unclaimed_amount ?? 0) > 0 && (
                <Button size="sm" onClick={handleClaimCommissions} disabled={actionLoading}>
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Claim All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Unclaimed Amount</span>
                  <span className="font-medium">${Number(dashboard?.unclaimed_amount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Total Earned (All Time)</span>
                  <span className="font-medium">${Number(dashboard?.total_earned ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Commission Rate</span>
                  <span className="font-medium">{dashboard?.commission_rate ?? dashboard?.rate ?? "—"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Commission History</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : commissions.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">No commission history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                    <tr>
                      {["ID", "Amount", "Status", "Date"].map(h => (
                        <th key={h} className="p-4 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {commissions.map(c => (
                      <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">#{c.id}</td>
                        <td className="p-4 font-medium">{c.currency ?? "$"}{Number(c.amount).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", STATUS_STYLES[c.status] ?? "bg-gray-100 text-gray-600")}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Withdrawals Tab */}
      {tab === "withdrawals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Available: <strong>${Number(summary?.available_balance ?? 0).toFixed(2)}</strong>
            </p>
            <Button size="sm" onClick={() => setWithdrawDialog(true)} disabled={(summary?.available_balance ?? 0) <= 0}>
              <Wallet className="mr-2 h-4 w-4" /> Request Withdrawal
            </Button>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Withdrawal History</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : withdrawals.length === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">No withdrawal requests yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                      <tr>
                        {["ID", "Amount", "Method", "Status", "Date"].map(h => (
                          <th key={h} className="p-4 font-medium text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {withdrawals.map(w => (
                        <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted-foreground">#{w.id}</td>
                          <td className="p-4 font-medium">{w.currency ?? "$"}{Number(w.amount).toFixed(2)}</td>
                          <td className="p-4 text-xs capitalize">{w.payment_method ?? "—"}</td>
                          <td className="p-4">
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", STATUS_STYLES[w.status] ?? "bg-gray-100 text-gray-600")}>
                              {w.status}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                            {w.created_at ? new Date(w.created_at).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Available balance: <strong>${Number(summary?.available_balance ?? 0).toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="space-y-1">
            <Label htmlFor="wd-amount">Amount</Label>
            <Input id="wd-amount" type="number" step="0.01" min="1"
              placeholder="Enter amount" value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wd-method">Payment Method</Label>
            <Input id="wd-method" placeholder="e.g. PayPal, Bank Transfer" value={withdrawMethod}
              onChange={e => setWithdrawMethod(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wd-details">Payment Details (optional)</Label>
            <Input id="wd-details" placeholder="e.g. PayPal email or bank details" value={withdrawDetails}
              onChange={e => setWithdrawDetails(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} disabled={actionLoading || !withdrawAmount || !withdrawMethod}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
