"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { installService } from "@/services/install.service";
import { ArrowRight, ChevronLeft, Globe, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InstallAppDetails() {
  const [data, setData] = useState({
    app_name: "Karsaaz QR",
    app_slogan: "Ultimate QR Code Management System",
  });
  const { call, isLoading } = useApi();
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await call(() => installService.saveStep(data));
      toast.success("App details saved");
      router.push("/install/database");
    } catch (error) {
      toast.error("Failed to save app details");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">Application Settings</h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Customize your platform identity</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">App Name</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                value={data.app_name}
                onChange={e => setData({...data, app_name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">App Slogan</Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12 rounded-xl border-2" 
                value={data.app_slogan}
                onChange={e => setData({...data, app_slogan: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed">
          <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
            <Link href="/install/purchase-code"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Link>
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
