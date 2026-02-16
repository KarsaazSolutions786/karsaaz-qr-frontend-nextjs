"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import billingService, { SubscriptionPlan } from "@/services/billing.service";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Trash,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Subscription {
  id: string | number;
  user_id: string | number;
  user?: { name?: string; email?: string };
  plan_id: string | number;
  subscription_plan?: SubscriptionPlan;
  status: string;
  expires_at?: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  active:          "bg-green-100 text-green-700",
  expired:         "bg-gray-100 text-gray-600",
  pending_payment: "bg-yellow-100 text-yellow-700",
  canceled:        "bg-red-100 text-red-700",
};

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);

  const [deleteTarget, setDeleteTarget]   = useState<Subscription | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [syncing, setSyncing]             = useState(false);
  const [deletingPending, setDeletingPending] = useState(false);
  const [deletePendingDialog, setDeletePendingDialog] = useState(false);

  const fetchSubscriptions = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await billingService.getSubscriptions({ page, search });
      const data = (res as { data?: { data?: Subscription[]; last_page?: number; current_page?: number } })?.data ?? res;
      setSubscriptions(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
      setTotalPages(data?.last_page ?? 1);
      setCurrentPage(data?.current_page ?? page);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]); // Dependency on search and currentPage to refetch when it changes

  useEffect(() => { fetchSubscriptions(1); }, [fetchSubscriptions]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await billingService.syncSubscriptions();
      toast.success("Subscriptions synced from Stripe");
      fetchSubscriptions(currentPage);
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleDeletePending = async () => {
    setDeletingPending(true);
    try {
      await billingService.deletePendingSubscriptions();
      toast.success("Pending subscriptions deleted");
      setDeletePendingDialog(false);
      fetchSubscriptions(1);
    } catch {
      toast.error("Failed to delete pending subscriptions");
    } finally {
      setDeletingPending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await billingService.deleteSubscription(deleteTarget.id);
      toast.success("Subscription deleted");
      setDeleteTarget(null);
      fetchSubscriptions(currentPage);
    } catch {
      toast.error("Failed to delete subscription");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground text-sm">Manage all user subscriptions.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing || loading}>
            <RotateCcw className={cn("h-4 w-4 mr-2", syncing && "animate-spin")} />
            Sync from Stripe
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeletePendingDialog(true)}>
            <XCircle className="h-4 w-4 mr-2" />
            Delete Pending
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchSubscriptions(currentPage)} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-8 h-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchSubscriptions(1)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchSubscriptions(1)}>Search</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell className="text-sm">
                      <div>
                        <p className="font-medium">{sub.user?.name ?? sub.user?.email ?? `User #${sub.user_id}`}</p>
                        {sub.user?.email && sub.user?.name && (
                          <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {sub.subscription_plan?.name ?? `Plan #${sub.plan_id}`}
                      {sub.subscription_plan?.price != null && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({sub.subscription_plan.currency} {sub.subscription_plan.price}/{sub.subscription_plan.frequency})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                        STATUS_STYLES[sub.status] ?? "bg-gray-100 text-gray-600"
                      )}>
                        {sub.status?.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => setDeleteTarget(sub)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); fetchSubscriptions(Math.max(1, currentPage - 1)); }} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); fetchSubscriptions(Math.min(totalPages, currentPage + 1)); }} disabled={currentPage === totalPages}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogHeader>
          <DialogTitle>Delete Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subscription for{" "}
            &quot;{deleteTarget?.user?.name ?? deleteTarget?.user?.email ?? `User #${deleteTarget?.user_id}`}&quot;?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Pending Confirm Dialog */}
      <Dialog open={deletePendingDialog} onClose={() => setDeletePendingDialog(false)}>
        <DialogHeader>
          <DialogTitle>Delete All Pending Subscriptions</DialogTitle>
          <DialogDescription>
            This will permanently delete all subscriptions with status &quot;pending_payment&quot;. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletePendingDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeletePending} disabled={deletingPending}>
            {deletingPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Pending
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
