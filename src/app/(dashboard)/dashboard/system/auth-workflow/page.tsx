"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

interface AuthWorkflowSettings {
    registration_enabled?: boolean;
    email_verification?: boolean;
    social_login?: boolean;
    passwordless_login?: boolean;
}

export default function SystemAuthWorkflowPage() {
    const [settings, setSettings] = useState<AuthWorkflowSettings>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        systemService.getAuthWorkflow()
            .then((data: AuthWorkflowSettings) => setSettings(data || {}))
            .catch(() => toast.error("Failed to load auth workflow settings"))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await systemService.updateAuthWorkflow(settings);
            toast.success("Auth workflow settings saved");
        } catch (_error: unknown) { toast.error("Failed to save settings"); }
        finally { setIsSaving(false); }
    };

    if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <KeyRound className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Auth Workflow</h1>
                    <p className="text-muted-foreground">Configure authentication and registration behavior.</p>
                </div>
            </div>
            <Card>
                <CardHeader><CardTitle>Authentication Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Registration</Label><Input value={settings.registration_enabled !== false ? "Enabled" : "Disabled"} readOnly /></div>
                        <div><Label>Email Verification</Label><Input value={settings.email_verification ? "Required" : "Optional"} readOnly /></div>
                        <div><Label>Social Login</Label><Input value={settings.social_login ? "Enabled" : "Disabled"} readOnly /></div>
                        <div><Label>Passwordless Login</Label><Input value={settings.passwordless_login ? "Enabled" : "Disabled"} readOnly /></div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Settings
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
