"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import cloudStorageService, { CloudConnection, CloudProvider } from "@/services/cloud-storage.service";
import { CheckCircle, Cloud, HardDrive, Loader2, Plus, RefreshCw, Trash2, Wifi, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PROVIDER_META: Record<CloudProvider, { label: string; color: string; icon: string }> = {
  google_drive: { label: "Google Drive", color: "bg-blue-100 text-blue-700", icon: "G" },
  dropbox:      { label: "Dropbox",      color: "bg-indigo-100 text-indigo-700", icon: "D" },
  onedrive:     { label: "OneDrive",     color: "bg-sky-100 text-sky-700", icon: "O" },
  mega:         { label: "MEGA",         color: "bg-red-100 text-red-700", icon: "M" },
};

export default function CloudStoragePage() {
  const [connections, setConnections] = useState<CloudConnection[]>([]);
  const [backupJobs, setBackupJobs]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [connecting, setConnecting]   = useState<CloudProvider | null>(null);

  const [megaDialog, setMegaDialog]   = useState(false);
  const [megaEmail, setMegaEmail]     = useState("");
  const [megaPassword, setMegaPassword] = useState("");
  const [megaLoading, setMegaLoading] = useState(false);

  const [backupDialog, setBackupDialog] = useState<string | number | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [connsRes, jobsRes] = await Promise.allSettled([
        cloudStorageService.getConnections(),
        cloudStorageService.getBackupJobs(),
      ]);
      if (connsRes.status === "fulfilled") {
        const d = (connsRes.value as any)?.data ?? connsRes.value;
        setConnections(Array.isArray(d) ? d : []);
      }
      if (jobsRes.status === "fulfilled") {
        const d = (jobsRes.value as any)?.data ?? jobsRes.value;
        setBackupJobs(Array.isArray(d) ? d : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const connectOAuth = async (provider: Exclude<CloudProvider, "mega">) => {
    setConnecting(provider);
    try {
      const res = await cloudStorageService.getAuthUrl(provider);
      const url  = (res as any)?.url ?? (res as any)?.auth_url;
      if (url) window.location.href = url;
      else toast.error("Could not get OAuth URL from server");
    } catch {
      toast.error(`Failed to connect ${PROVIDER_META[provider].label}`);
    } finally {
      setConnecting(null);
    }
  };

  const connectMega = async () => {
    if (!megaEmail || !megaPassword) return;
    setMegaLoading(true);
    try {
      await cloudStorageService.connectMega({ email: megaEmail, password: megaPassword });
      toast.success("MEGA connected successfully");
      setMegaDialog(false); setMegaEmail(""); setMegaPassword("");
      fetchData();
    } catch { toast.error("Failed to connect MEGA. Check your credentials."); }
    finally { setMegaLoading(false); }
  };

  const testConnection = async (id: string | number) => {
    try { await cloudStorageService.testConnection(id); toast.success("Connection is healthy"); }
    catch { toast.error("Connection test failed"); }
  };

  const deleteConnection = async (id: string | number) => {
    try {
      await cloudStorageService.deleteConnection(id);
      toast.success("Connection removed");
      setConnections(p => p.filter(c => c.id !== id));
    } catch { toast.error("Failed to remove connection"); }
  };

  const startBackup = async (connectionId: string | number) => {
    setBackupLoading(true); setBackupDialog(null);
    try {
      await cloudStorageService.createBackup({ connection_id: connectionId });
      toast.success("Backup started successfully"); fetchData();
    } catch { toast.error("Failed to start backup"); }
    finally { setBackupLoading(false); }
  };

  const deleteBackupJob = async (id: string | number) => {
    try {
      await cloudStorageService.deleteBackupJob(id);
      setBackupJobs(p => p.filter(j => j.id !== id));
      toast.success("Backup record deleted");
    } catch { toast.error("Failed to delete backup record"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cloud Storage</h1>
          <p className="text-sm text-muted-foreground">Connect providers to back up your QR codes automatically.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Connect Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connect a Provider</CardTitle>
          <CardDescription>Add a new cloud storage connection via OAuth or credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["google_drive", "dropbox", "onedrive"] as const).map(provider => (
              <Button key={provider} variant="outline" className="h-16 flex-col gap-1"
                onClick={() => connectOAuth(provider)} disabled={connecting === provider}>
                {connecting === provider
                  ? <Loader2 className="h-5 w-5 animate-spin" />
                  : <span className={`text-lg font-bold rounded px-1.5 ${PROVIDER_META[provider].color}`}>{PROVIDER_META[provider].icon}</span>}
                <span className="text-xs">{PROVIDER_META[provider].label}</span>
              </Button>
            ))}
            <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => setMegaDialog(true)}>
              <span className={`text-lg font-bold rounded px-1.5 ${PROVIDER_META.mega.color}`}>M</span>
              <span className="text-xs">MEGA</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="h-4 w-4" /> Active Connections
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{connections.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : connections.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <HardDrive className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No connections yet. Connect a provider above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {connections.map(conn => {
                const meta = PROVIDER_META[conn.provider] ?? { label: conn.provider, color: "bg-gray-100 text-gray-700", icon: "?" };
                return (
                  <div key={conn.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold rounded px-2 py-1 ${meta.color}`}>{meta.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{meta.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {conn.account_email ?? "Connected"} • {conn.last_used_at ? `Last used ${new Date(conn.last_used_at).toLocaleDateString()}` : "Never used"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {conn.is_active ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => testConnection(conn.id)}>
                        <Wifi className="h-3 w-3 mr-1" /> Test
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setBackupDialog(conn.id)}>
                        <Plus className="h-3 w-3 mr-1" /> Backup
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteConnection(conn.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Jobs */}
      {backupJobs.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Backup History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {backupJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                  <div>
                    <p className="font-medium">{job.backup_type ?? "Full Backup"}</p>
                    <p className="text-xs text-muted-foreground">{job.started_at ? new Date(job.started_at).toLocaleString() : "Pending"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${job.status === "completed" ? "bg-green-100 text-green-700" : job.status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {job.status}
                    </span>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteBackupJob(job.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MEGA Connect Dialog */}
      <Dialog open={megaDialog} onClose={() => setMegaDialog(false)}>
        <DialogHeader>
          <DialogTitle>Connect MEGA</DialogTitle>
          <DialogDescription>Enter your MEGA account credentials to connect.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="mega-email">MEGA Email</Label>
            <Input id="mega-email" type="email" placeholder="you@mega.nz" value={megaEmail} onChange={e => setMegaEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mega-password">MEGA Password</Label>
            <Input id="mega-password" type="password" placeholder="••••••••" value={megaPassword} onChange={e => setMegaPassword(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setMegaDialog(false)}>Cancel</Button>
          <Button onClick={connectMega} disabled={megaLoading || !megaEmail || !megaPassword}>
            {megaLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Connect
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Backup Confirm Dialog */}
      <Dialog open={backupDialog !== null} onClose={() => setBackupDialog(null)}>
        <DialogHeader>
          <DialogTitle>Start Backup</DialogTitle>
          <DialogDescription>Back up all your QR code data to this cloud storage connection.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setBackupDialog(null)}>Cancel</Button>
          <Button onClick={() => backupDialog !== null && startBackup(backupDialog)} disabled={backupLoading}>
            {backupLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Start Backup
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
