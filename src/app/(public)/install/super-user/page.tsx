"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { installService } from "@/services/install.service";
import { ArrowRight, ChevronLeft, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InstallSuperUser() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const { call, isLoading } = useApi();
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.password !== data.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await call(() => installService.saveStep({ ...data, step: 'superuser' }));
      toast.success("Administrator account configured");
      router.push("/install/mail");
    } catch (error) {
      toast.error("Failed to create administrator account");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Admin Account</h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Create the primary superuser account</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                placeholder="e.g. Admin User"
                value={data.name}
                onChange={e => setData({...data, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email"
                className="pl-10 h-12 rounded-xl border-2" 
                placeholder="admin@karsaaz.com"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  className="pl-10 h-12 rounded-xl border-2" 
                  placeholder="••••••••"
                  value={data.password}
                  onChange={e => setData({...data, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  className="pl-10 h-12 rounded-xl border-2" 
                  placeholder="••••••••"
                  value={data.password_confirmation}
                  onChange={e => setData({...data, password_confirmation: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed">
          <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
            <Link href="/install/database"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase font-black text-[10px] tracking-widest">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
