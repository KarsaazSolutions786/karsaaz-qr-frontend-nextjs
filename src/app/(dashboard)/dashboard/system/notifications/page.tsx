"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

export default function SystemNotificationsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        systemService.getNotificationSettings()
            .then((data) => setSettings(data || {}))
            .catch(() => toast.error("Failed to load notification settings"))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await systemService.updateNotificationSettings(settings);
            toast.success("Notification settings saved");
        } catch { toast.error("Failed to save settings"); }
        finally { setIsSaving(false); }
    };

    if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">Configure email and push notification settings.</p>
                </div>
            </div>
            <Card>
                <CardHeader><CardTitle>Email Notifications</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Admin Email</Label><Input value={settings.admin_email || ""} onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })} /></div>
                        <div><Label>From Name</Label><Input value={settings.from_name || ""} onChange={(e) => setSettings({ ...settings, from_name: e.target.value })} /></div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
