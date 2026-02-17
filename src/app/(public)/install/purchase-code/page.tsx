"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { installService } from "@/services/install.service";
import { ArrowRight, ChevronLeft, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InstallPurchaseCode() {
  const [code, setCode] = useState("");
  const { call, isLoading } = useApi();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      await call(() => installService.verifyPurchaseCode(code));
      toast.success("Purchase code verified successfully");
      router.push("/install/app-details");
    } catch (error) {
      toast.error("Invalid purchase code. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">License Verification</h2>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Provide your Envato purchase code</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Purchase Code</Label>
          <div className="relative">
            <ShoppingBag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 h-12 rounded-xl border-2" 
              placeholder="e.g. 1234abcd-1234-abcd-1234-abcd1234abcd" 
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
          </div>
          <p className="text-[9px] font-medium text-muted-foreground uppercase">You can find this in your Envato market downloads section</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed">
          <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
            <Link href="/install"><ChevronLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase font-black text-[10px] tracking-widest">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Verify & Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
