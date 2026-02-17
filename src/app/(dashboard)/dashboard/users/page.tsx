"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import accountService from "@/services/account.service";
import { User, userService } from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  DollarSign,
  Link2,
  Loader2,
  MoreVertical,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  User as UserIcon, // Renamed to avoid conflict with User interface
  UserPlus,
  UserSquare2
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";



function UsersManagementContent() {

  const searchParams = useSearchParams();

  const payingFilter = searchParams.get("paying");



  const [users, setUsers]           = useState<User[]>([]);

  const [total, setTotal]           = useState(0);

  const [page, setPage]             = useState(1);

  const [search, setSearch]         = useState("");

  const [loading, setLoading]       = useState(true);



  const [selected, setSelected]     = useState<User | null>(null);

  const [dialog, setDialog]         = useState<"magic-link" | "balance" | "delete" | null>(null);

  const [magicUrl, setMagicUrl]     = useState("");

  const [balanceAmount, setBalanceAmount] = useState("");



  const { setActingAs } = useAuthStore();

  const { call, isLoading: actionLoading } = useApi();



  const fetchUsers = useCallback(async () => {

    setLoading(true);

    try {

      const res = await userService.getAllUsers({

        page,

        search: search || undefined,

        paying: payingFilter === "true" ? true : payingFilter === "false" ? false : undefined,

      });

      const data = res; // No need for `as any` here after fixing service

      setUsers(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);

      setTotal(data?.total ?? 0);

    } catch {

      setUsers([]);

    } finally {

      setLoading(false);

    }

  }, [page, search, payingFilter]);



  useEffect(() => { fetchUsers(); }, [fetchUsers]);



  const openDialog = (user: User, d: typeof dialog) => {

    setSelected(user);

    setMagicUrl("");

    setBalanceAmount("");

    setDialog(d);

  };



  const handleActAs = async (user: User) => {

    try {

      const response = await call(() => userService.actAs(user.id));

      const { token, user: newUser } = response; // No need for `as any` here

      if (token && newUser) {

        setActingAs(newUser, token);

        toast.success(`Now impersonating ${newUser.name}`);

        window.location.href = "/dashboard";

      }

    } catch { toast.error("Failed to impersonate user"); }

  };



  const handleGenerateMagicLink = async () => {

    if (!selected) return;

    try {

      const res = await call(() => accountService.generateMagicLoginUrl(selected.id));

      const url = (res as { data?: { url?: string }; url?: string })?.data?.url ?? res?.url;

      if (url) setMagicUrl(url);

      else toast.error("No URL returned from server");

    } catch { toast.error("Failed to generate magic login URL"); }

  };



  const handleCopyMagicUrl = () => {

    if (!magicUrl) return;

    navigator.clipboard.writeText(magicUrl);

    toast.success("URL copied to clipboard");

  };



  const handleResetRole = async (user: User) => {

    try {

      await call(() => userService.resetRole(user.id));

      toast.success("User role reset");

      fetchUsers();

    } catch { toast.error("Failed to reset role"); }

  };



  const handleResetQRLimit = async (user: User) => {

    try {

      await call(() => userService.resetQRCodeLimit(user.id));

      toast.success("QR code limit reset");

    } catch { toast.error("Failed to reset QR limit"); }

  };



  const handleResetScansLimit = async (user: User) => {

    try {

      await call(() => userService.resetScansLimit(user.id));

      toast.success("Scans limit reset");

    } catch { toast.error("Failed to reset scans limit"); }

  };



  const handleVerifyEmail = async (user: User) => {

    try {

      await call(() => userService.verifyEmail(user.id));

      toast.success("Email verified successfully");

      fetchUsers();

    } catch { toast.error("Failed to verify email"); }

  };



  const handleChangeBalance = async () => {

    if (!selected) return; // Removed || balanceAmount === ""

    const amount = parseFloat(balanceAmount);

    if (isNaN(amount)) { toast.error("Invalid amount"); return; }

    try {

      await call(() => userService.updateAccountBalance(selected.id, amount));

      toast.success("Account balance updated");

      setDialog(null);

      fetchUsers();

    } catch { toast.error("Failed to update balance"); }

  };



  const handleDelete = async () => {

    if (!selected) return;

    try {

      await call(() => userService.deleteUser(selected.id));

      toast.success("User deleted");

      setDialog(null);

      fetchUsers();

    } catch { toast.error("Failed to delete user"); }

  };



  const perPage = 15;

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm">
            {payingFilter === "true" ? "Paying Users" : payingFilter === "false" ? "Free Users" : "All Users"}
            {total > 0 && <span className="ml-1 text-xs">({total} total)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8 h-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50 dark:bg-gray-800/50">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-muted-foreground">User</th>
                    <th className="p-4 font-medium text-muted-foreground">Role</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground">Plan</th>
                    <th className="p-4 font-medium text-muted-foreground">Joined</th>
                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium leading-none">{u.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                            {!u.email_verified_at && (
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Unverified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 w-fit text-[11px] font-bold uppercase tracking-tight">
                          <Shield className="h-3 w-3" />
                          {u.roles?.[0]?.name ?? "—"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase",
                          u.active || u.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {(u.active || u.is_active) ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium">
                          {u.latest_subscription_plan?.name ?? u.plan ?? "Free"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleActAs(u)}>
                              <UserIcon className="mr-2 h-4 w-4" /> Act As User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog(u, "magic-link")}>
                              <Link2 className="mr-2 h-4 w-4" /> Magic Login URL
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleResetRole(u)}>
                              <ShieldAlert className="mr-2 h-4 w-4" /> Reset Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetQRLimit(u)}>
                              <QrCode className="mr-2 h-4 w-4" /> Reset QR Limit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetScansLimit(u)}>
                              <ScanLine className="mr-2 h-4 w-4" /> Reset Scans Limit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog(u, "balance")}>
                              <DollarSign className="mr-2 h-4 w-4" /> Change Balance
                            </DropdownMenuItem>
                            {!u.email_verified_at && (
                              <DropdownMenuItem onClick={() => handleVerifyEmail(u)}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Verify Email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => openDialog(u, "delete")}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Magic Login URL Dialog */}
      <Dialog open={dialog === "magic-link"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Magic Login URL</DialogTitle>
          <DialogDescription>Generate a one-time login link for {selected?.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {magicUrl ? (
            <div className="flex gap-2">
              <Input value={magicUrl} readOnly className="text-xs font-mono" />
              <Button size="sm" variant="outline" onClick={handleCopyMagicUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Click Generate to create a one-time login link for this user.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialog(null)}>Close</Button>
          <Button onClick={handleGenerateMagicLink} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {magicUrl ? "Regenerate" : "Generate"}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Balance Dialog */}
      <Dialog open={dialog === "balance"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Account Balance</DialogTitle>
          <DialogDescription>Set a new account balance for {selected?.name}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            step="0.01"
            placeholder="Enter new balance amount"
            value={balanceAmount}
            onChange={e => setBalanceAmount(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
          <Button onClick={handleChangeBalance} disabled={actionLoading || balanceAmount === ""}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Balance
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete {selected?.name} ({selected?.email})?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <UsersManagementContent />
    </Suspense>
  );
}
