"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

export default function SystemSmsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        systemService.getSmsPortals()
            .then((data) => setSettings(data || {}))
            .catch(() => toast.error("Failed to load SMS settings"))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await systemService.updateSmsPortals(settings);
            toast.success("SMS portal settings saved");
        } catch { toast.error("Failed to save settings"); }
        finally { setIsSaving(false); }
    };

    if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">SMS Portals</h1>
                    <p className="text-muted-foreground">Configure SMS gateway settings.</p>
                </div>
            </div>
            <Card>
                <CardHeader><CardTitle>SMS Gateway Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Provider</Label><Input value={settings.provider || ""} onChange={(e) => setSettings({ ...settings, provider: e.target.value })} /></div>
                        <div><Label>API Key</Label><Input type="password" value={settings.api_key || ""} onChange={(e) => setSettings({ ...settings, api_key: e.target.value })} /></div>
                        <div><Label>Sender ID</Label><Input value={settings.sender_id || ""} onChange={(e) => setSettings({ ...settings, sender_id: e.target.value })} /></div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
