"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import {
  Database,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  Save
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

export default function SystemSettingsPage() {
  const { call, isLoading } = useApi();
  const [settings, setSettings] = useState<any>({});

  const fetchSettings = async () => {
    try {
      const response = await call(() => systemService.getSettings());
      setSettings(response.data || response);
    } catch (error) { }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (section: string, data: any) => {
    try {
      await call(() => systemService.updateSettings({ ...data, section }));
      toast.success(`${section} settings saved`);
    } catch (error) { }
  };

  const testSmtp = async () => {
    try {
      await call(() => systemService.testSmtp());
      toast.success("Test email sent successfully");
    } catch (error) { }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-sm text-muted-foreground">Configure global application parameters and integrations.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="general" className="gap-2 h-10"><Globe className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="smtp" className="gap-2 h-10"><Mail className="h-4 w-4" /> SMTP</TabsTrigger>
          <TabsTrigger value="storage" className="gap-2 h-10"><Database className="h-4 w-4" /> Storage</TabsTrigger>
          <TabsTrigger value="security" className="gap-2 h-10"><Lock className="h-4 w-4" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Site Configuration</CardTitle>
              <CardDescription>Basic application information used across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>App Name</Label>
                  <Input defaultValue={settings.app_name || "Karsaaz QR"} />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue={settings.support_email} />
                </div>
              </div>
              <Button size="sm" className="gap-2" onClick={() => handleSave("general", {})}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Mail Settings</CardTitle>
                <CardDescription>Configure outgoing email server (Laravel Mail driver).</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={testSmtp} disabled={isLoading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} /> Test Connection
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input defaultValue={settings.mail_host} />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input type="number" defaultValue={settings.mail_port} />
                </div>
                <div className="space-y-2">
                  <Label>Encryption</Label>
                  <Input placeholder="tls/ssl" defaultValue={settings.mail_encryption} />
                </div>
              </div>
              <Button size="sm" className="gap-2" onClick={() => handleSave("smtp", {})}>
                <Save className="h-4 w-4" /> Save SMTP
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Storage</CardTitle>
              <CardDescription>Choose where to store QR logos and uploaded files.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Driver</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="local">Local Filesystem</option>
                    <option value="s3">AWS S3</option>
                    <option value="wasabi">Wasabi</option>
                  </select>
                </div>
              </div>
              <Button size="sm" className="gap-2" onClick={() => handleSave("storage", {})}>
                <Save className="h-4 w-4" /> Save Storage
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}