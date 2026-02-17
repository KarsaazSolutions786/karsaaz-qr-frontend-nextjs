"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { installService } from "@/services/install.service";
import { ArrowRight, ChevronLeft, Database, Loader2, Server } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InstallDatabase() {
  const [data, setData] = useState({
    db_host: "127.0.0.1",
    db_port: "3306",
    db_name: "",
    db_user: "",
    db_password: "",
  });
  const { call, isLoading } = useApi();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await call(() => installService.verifyDatabase(data));
      toast.success("Database connection successful");
      router.push("/install/super-user");
    } catch (error) {
      toast.error("Database connection failed. Please check your credentials.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Database Configuration</h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Setup your MySQL/MariaDB connection</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Host</Label>
            <div className="relative">
              <Server className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                value={data.db_host}
                onChange={e => setData({...data, db_host: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Port</Label>
            <Input 
              className="h-12 rounded-xl border-2" 
              value={data.db_port}
              onChange={e => setData({...data, db_port: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Database Name</Label>
            <div className="relative">
              <Database className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                placeholder="e.g. karsaaz_qr"
                value={data.db_name}
                onChange={e => setData({...data, db_name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
            <Input 
              className="h-12 rounded-xl border-2" 
              placeholder="e.g. root"
              value={data.db_user}
              onChange={e => setData({...data, db_user: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
            <Input 
              type="password"
              className="h-12 rounded-xl border-2" 
              placeholder="••••••••"
              value={data.db_password}
              onChange={e => setData({...data, db_password: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed">
          <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
            <Link href="/install/app-details"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase font-black text-[10px] tracking-widest">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Test & Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
