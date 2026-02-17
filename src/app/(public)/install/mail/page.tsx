"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { installService } from "@/services/install.service";
import { ArrowRight, ChevronLeft, Loader2, Mail, Server } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InstallMail() {
  const [data, setData] = useState({
    mail_driver: "smtp",
    mail_host: "",
    mail_port: "587",
    mail_username: "",
    mail_password: "",
    mail_encryption: "tls",
    mail_from_address: "",
    mail_from_name: "Karsaaz QR",
  });
  const { call, isLoading } = useApi();
  const router = useRouter();

  const handleTest = async () => {
    try {
      await call(() => installService.verifyMail(data));
      toast.success("Test email sent successfully");
    } catch (error) {
      toast.error("Failed to send test email. Please check settings.");
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await call(() => installService.saveStep({ ...data, step: 'mail' }));
      await call(() => installService.complete());
      toast.success("Installation completed successfully!");
      router.push("/login?installed=true");
    } catch (error) {
      toast.error("Failed to complete installation");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Mail Configuration</h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Setup SMTP for system notifications</p>
      </div>

      <form onSubmit={handleComplete} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SMTP Host</Label>
            <div className="relative">
              <Server className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                placeholder="e.g. smtp.mailtrap.io"
                value={data.mail_host}
                onChange={e => setData({...data, mail_host: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SMTP Port</Label>
            <Input 
              className="h-12 rounded-xl border-2" 
              value={data.mail_port}
              onChange={e => setData({...data, mail_port: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
            <Input 
              className="h-12 rounded-xl border-2" 
              value={data.mail_username}
              onChange={e => setData({...data, mail_username: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
            <Input 
              type="password"
              className="h-12 rounded-xl border-2" 
              value={data.mail_password}
              onChange={e => setData({...data, mail_password: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Encryption</Label>
            <Select value={data.mail_encryption} onValueChange={v => setData({...data, mail_encryption: v})}>
              <SelectTrigger className="h-12 rounded-xl border-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">From Name</Label>
            <Input 
              className="h-12 rounded-xl border-2" 
              value={data.mail_from_name}
              onChange={e => setData({...data, mail_from_name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">From Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email"
                className="pl-10 h-12 rounded-xl border-2" 
                placeholder="noreply@karsaaz.com"
                value={data.mail_from_address}
                onChange={e => setData({...data, mail_from_address: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dashed">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
              <Link href="/install/super-user"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Link>
            </Button>
            <Button type="button" variant="outline" onClick={handleTest} className="rounded-xl border-2 uppercase font-black text-[10px] tracking-widest">
              Test SMTP
            </Button>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto rounded-xl px-12 h-12 bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 uppercase font-black text-[10px] tracking-widest">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Complete Installation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
