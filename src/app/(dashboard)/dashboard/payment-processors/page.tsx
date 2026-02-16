"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import paymentGatewayService from "@/services/payment-gateway.service";
import stripeService from "@/services/stripe.service";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Edit2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Webhook,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentProcessorsPage() {
  const [tab, setTab] = useState<"gateways" | "webhooks">("gateways");

  const [gateways, setGateways]     = useState<any[]>([]);
  const [webhooks, setWebhooks]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Gateway dialog
  const [gwDialog, setGwDialog]     = useState<"create" | "edit" | null>(null);
  const [selectedGw, setSelectedGw] = useState<any>(null);
  const [gwForm, setGwForm]         = useState<Record<string, string>>({});

  // Webhook dialog
  const [whDialog, setWhDialog]     = useState(false);
  const [whUrl, setWhUrl]           = useState("");
  const [whEvents, setWhEvents]     = useState("");

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{ type: "gateway"; item: any } | null>(null);

  const fetchGateways = async () => {
    try {
      const res = await paymentGatewayService.getAll();
      const d = (res as any)?.data ?? res;
      setGateways(Array.isArray(d) ? d : []);
    } catch { setGateways([]); }
  };

  const fetchWebhooks = async () => {
    try {
      const res = await stripeService.getWebhooks();
      const d = (res as any)?.data ?? res;
      setWebhooks(Array.isArray(d) ? d : []);
    } catch { setWebhooks([]); }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.allSettled([fetchGateways(), fetchWebhooks()]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreateGateway = () => {
    setSelectedGw(null);
    setGwForm({});
    setGwDialog("create");
  };

  const openEditGateway = (gw: any) => {
    setSelectedGw(gw);
    setGwForm({
      name: gw.name ?? "",
      driver: gw.driver ?? "",
      key: gw.key ?? "",
      secret: gw.secret ?? "",
      mode: gw.mode ?? "sandbox",
    });
    setGwDialog("edit");
  };

  const handleSaveGateway = async () => {
    setActionLoading(true);
    try {
      if (gwDialog === "create") {
        await paymentGatewayService.create(gwForm);
        toast.success("Payment gateway created");
      } else if (gwDialog === "edit" && selectedGw) {
        await paymentGatewayService.update(selectedGw.id, gwForm);
        toast.success("Payment gateway updated");
      }
      setGwDialog(null);
      fetchGateways();
    } catch { toast.error("Failed to save payment gateway"); }
    finally { setActionLoading(false); }
  };

  const handleDeleteGateway = async () => {
    if (!deleteDialog) return;
    setActionLoading(true);
    try {
      await paymentGatewayService.delete(deleteDialog.item.id);
      toast.success("Payment gateway deleted");
      setDeleteDialog(null);
      fetchGateways();
    } catch { toast.error("Failed to delete payment gateway"); }
    finally { setActionLoading(false); }
  };

  const handleCreateWebhook = async () => {
    setActionLoading(true);
    try {
      await stripeService.createWebhook({
        url: whUrl || undefined,
        events: whEvents ? whEvents.split(",").map(e => e.trim()) : undefined,
      });
      toast.success("Stripe webhook created");
      setWhDialog(false);
      setWhUrl(""); setWhEvents("");
      fetchWebhooks();
    } catch { toast.error("Failed to create webhook"); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Payment Processors
          </h1>
          <p className="text-sm text-muted-foreground">Manage payment gateways and Stripe webhook endpoints.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b flex">
        {(["gateways", "webhooks"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            {t === "gateways" ? "Payment Gateways" : "Stripe Webhooks"}
          </button>
        ))}
      </div>

      {/* Gateways Tab */}
      {tab === "gateways" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base">Payment Gateways</CardTitle>
            <Button size="sm" onClick={openCreateGateway}>
              <Plus className="h-4 w-4 mr-2" /> Add Gateway
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : gateways.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No payment gateways configured.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                    <tr>
                      {["Name", "Driver", "Mode", "Actions"].map(h => (
                        <th key={h} className="p-4 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {gateways.map(gw => (
                      <tr key={gw.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-medium">{gw.name ?? gw.id}</td>
                        <td className="p-4 text-xs capitalize text-muted-foreground">{gw.driver ?? "—"}</td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                            (gw.mode ?? "sandbox") === "live"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          )}>
                            {gw.mode ?? "sandbox"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEditGateway(gw)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                              onClick={() => setDeleteDialog({ type: "gateway", item: gw })}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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
      )}

      {/* Webhooks Tab */}
      {tab === "webhooks" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="h-4 w-4" /> Stripe Webhooks
            </CardTitle>
            <Button size="sm" onClick={() => setWhDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Webhook
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : webhooks.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                <Webhook className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No Stripe webhooks configured.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800/50 text-left">
                    <tr>
                      {["URL", "Status", "Events"].map(h => (
                        <th key={h} className="p-4 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {webhooks.map((wh: any, i) => (
                      <tr key={wh.id ?? i} className="hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-mono text-xs max-w-xs truncate">{wh.url ?? wh.webhook_url ?? "—"}</td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                            wh.status === "enabled" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {wh.status ?? "unknown"}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {Array.isArray(wh.enabled_events) ? wh.enabled_events.slice(0, 2).join(", ") + (wh.enabled_events.length > 2 ? "..." : "") : "—"}
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

      {/* Gateway Create/Edit Dialog */}
      <Dialog open={gwDialog !== null} onClose={() => setGwDialog(null)}>
        <DialogHeader>
          <DialogTitle>{gwDialog === "create" ? "Add Payment Gateway" : "Edit Payment Gateway"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {[
            { key: "name", label: "Name", placeholder: "e.g. Stripe" },
            { key: "driver", label: "Driver", placeholder: "e.g. stripe, paypal" },
            { key: "key", label: "API Key / Client ID", placeholder: "pk_..." },
            { key: "secret", label: "Secret Key", placeholder: "sk_..." },
            { key: "mode", label: "Mode (live/sandbox)", placeholder: "sandbox" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`gw-${key}`}>{label}</Label>
              <Input id={`gw-${key}`} placeholder={placeholder} value={gwForm[key] ?? ""}
                onChange={e => setGwForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setGwDialog(null)}>Cancel</Button>
          <Button onClick={handleSaveGateway} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {gwDialog === "create" ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Webhook Create Dialog */}
      <Dialog open={whDialog} onClose={() => setWhDialog(false)}>
        <DialogHeader>
          <DialogTitle>Add Stripe Webhook</DialogTitle>
          <DialogDescription>Register a new endpoint to receive Stripe events.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="space-y-1">
            <Label htmlFor="wh-url">Endpoint URL (optional)</Label>
            <Input id="wh-url" placeholder="https://yoursite.com/webhooks/stripe" value={whUrl}
              onChange={e => setWhUrl(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wh-events">Events (comma-separated, optional)</Label>
            <Input id="wh-events" placeholder="payment_intent.succeeded, customer.subscription.updated"
              value={whEvents} onChange={e => setWhEvents(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setWhDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateWebhook} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Webhook
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog !== null} onClose={() => setDeleteDialog(null)}>
        <DialogHeader>
          <DialogTitle>Delete Payment Gateway</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{deleteDialog?.item?.name}"? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteGateway} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
