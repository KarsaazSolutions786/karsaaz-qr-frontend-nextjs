"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/auth.service";
import type { Session } from "@/services/auth.service";
import {
  AlertTriangle,
  CheckCircle,
  Globe,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  Monitor,
  RefreshCw,
  Shield,
  ShieldOff,
  Smartphone,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SecurityPage() {
  const [sessions, setSessions]     = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [twoFaStatus, setTwoFaStatus] = useState<{ enabled: boolean; confirmed: boolean } | null>(null);
  const [twoFaLoading, setTwoFaLoading] = useState(true);

  const [setupData, setSetupData]   = useState<{ qr_code?: string; secret?: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [twoFaDialog, setTwoFaDialog] = useState<"setup" | "disable" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [revokeAllDialog, setRevokeAllDialog] = useState(false);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await authService.getSessions();
      const data = (res as { data?: Session[] })?.data ?? res;
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const fetchTwoFaStatus = useCallback(async () => {
    setTwoFaLoading(true);
    try {
      const res = await authService.get2faStatus();
      const data = (res as { data?: { enabled: boolean; confirmed: boolean } })?.data ?? res;
      setTwoFaStatus(data);
    } catch {
      setTwoFaStatus(null);
    } finally {
      setTwoFaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchTwoFaStatus();
  }, [fetchSessions, fetchTwoFaStatus]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authService.revokeSession(sessionId);
      toast.success("Session revoked");
      setSessions(p => p.filter(s => s.id !== sessionId));
    } catch { toast.error("Failed to revoke session"); }
  };

  const handleRevokeAll = async () => {
    setActionLoading(true);
    try {
      await authService.revokeAllSessions();
      toast.success("All sessions revoked");
      setRevokeAllDialog(false);
      fetchSessions();
    } catch { toast.error("Failed to revoke all sessions"); }
    finally { setActionLoading(false); }
  };

  const handleSetup2fa = async () => {
    setActionLoading(true);
    try {
      const res = await authService.setup2fa();
      const data = (res as { data?: { qr_code?: string; secret?: string } })?.data ?? res;
      setSetupData(data);
      setConfirmCode("");
      setTwoFaDialog("setup");
    } catch { toast.error("Failed to set up 2FA"); }
    finally { setActionLoading(false); }
  };

  const handleConfirm2fa = async () => {
    if (!confirmCode) return;
    setActionLoading(true);
    try {
      await authService.confirm2fa(confirmCode);
      toast.success("Two-factor authentication enabled");
      setTwoFaDialog(null);
      setSetupData(null);
      fetchTwoFaStatus();
    } catch { toast.error("Invalid code. Please try again."); }
    finally { setActionLoading(false); }
  };

  const handleDisable2fa = async () => {
    if (!disableCode) return;
    setActionLoading(true);
    try {
      await authService.disable2fa(disableCode);
      toast.success("Two-factor authentication disabled");
      setTwoFaDialog(null);
      setDisableCode("");
      fetchTwoFaStatus();
    } catch { toast.error("Invalid code. Please try again."); }
    finally { setActionLoading(false); }
  };

  const getDeviceIcon = (session: Session) => {
    const device = (session.device ?? "").toLowerCase();
    if (device.includes("mobile") || device.includes("phone")) return <Smartphone className="h-5 w-5" />;
    if (device.includes("tablet")) return <Monitor className="h-5 w-5" />;
    return <Laptop className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Security
        </h1>
        <p className="text-sm text-muted-foreground">Manage your active sessions and two-factor authentication.</p>
      </div>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" /> Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account with TOTP.</CardDescription>
        </CardHeader>
        <CardContent>
          {twoFaLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading 2FA status...
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {twoFaStatus?.enabled ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-sm">
                    {twoFaStatus?.enabled ? "Enabled" : "Not enabled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {twoFaStatus?.enabled
                      ? "Your account is protected with two-factor authentication."
                      : "Enable 2FA to protect your account from unauthorized access."}
                  </p>
                </div>
              </div>
              {twoFaStatus?.enabled ? (
                <Button variant="outline" size="sm" onClick={() => { setDisableCode(""); setTwoFaDialog("disable"); }}>
                  <ShieldOff className="h-4 w-4 mr-2" /> Disable 2FA
                </Button>
              ) : (
                <Button size="sm" onClick={handleSetup2fa} disabled={actionLoading}>
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Shield className="h-4 w-4 mr-2" /> Enable 2FA
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" /> Active Sessions
              </CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchSessions} disabled={sessionsLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${sessionsLoading ? "animate-spin" : ""}`} /> Refresh
              </Button>
              {sessions.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => setRevokeAllDialog(true)}>
                  <LogOut className="h-4 w-4 mr-2" /> Revoke All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No active sessions found.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">{getDeviceIcon(session)}</div>
                    <div>
                      <p className="font-medium text-sm">
                        {session.browser ?? session.device ?? "Unknown browser"}
                        {session.is_current && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Current</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.ip_address && <span>{session.ip_address} · </span>}
                        {session.last_active_at
                          ? `Last active ${new Date(session.last_active_at).toLocaleString()}`
                          : "Unknown last activity"}
                      </p>
                    </div>
                  </div>
                  {!session.is_current && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRevokeSession(session.id)}>
                      <LogOut className="h-3.5 w-3.5 mr-1" /> Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2FA Setup Dialog */}
      <Dialog open={twoFaDialog === "setup"} onClose={() => setTwoFaDialog(null)}>
        <DialogHeader>
          <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the code to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {setupData?.qr_code && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setupData.qr_code} alt="2FA QR Code" className="border rounded-lg p-2 bg-white" width={200} height={200} />
            </div>
          )}
          {setupData?.secret && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Or enter this secret manually:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{setupData.secret}</code>
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="confirm-code">Verification Code</Label>
            <Input id="confirm-code" type="text" inputMode="numeric" maxLength={6}
              placeholder="Enter 6-digit code" value={confirmCode}
              onChange={e => setConfirmCode(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setTwoFaDialog(null)}>Cancel</Button>
          <Button onClick={handleConfirm2fa} disabled={actionLoading || confirmCode.length < 6}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Enable
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 2FA Disable Dialog */}
      <Dialog open={twoFaDialog === "disable"} onClose={() => setTwoFaDialog(null)}>
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
          <DialogDescription>Enter your current authenticator code to disable 2FA.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input type="text" inputMode="numeric" maxLength={6}
            placeholder="Enter 6-digit code" value={disableCode}
            onChange={e => setDisableCode(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setTwoFaDialog(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDisable2fa} disabled={actionLoading || disableCode.length < 6}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Disable 2FA
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Revoke All Dialog */}
      <Dialog open={revokeAllDialog} onClose={() => setRevokeAllDialog(false)}>
        <DialogHeader>
          <DialogTitle>Revoke All Sessions</DialogTitle>
          <DialogDescription>
            This will sign out all devices except your current session. You will need to log in again on other devices.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setRevokeAllDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleRevokeAll} disabled={actionLoading}>
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Revoke All Sessions
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
