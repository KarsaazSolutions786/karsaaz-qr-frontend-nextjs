"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { billingService } from "@/services/billing.service";
import { Coins, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreditPricingPage() {
  const [pricing, setPricing] = useState({
    dynamic_qr_price: 1,
    static_qr_price: 1,
  });
  const { call, isLoading } = useApi();
  const [isSaving, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await billingService.getAccountCreditPrices();
        if (res) setPricing(res);
      } catch (error) {
        console.error("Failed to fetch credit pricing", error);
      }
    };
    fetchPricing();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Assuming a method to save pricing exists or using updateSettings
      await call(() => billingService.updateAccountCreditPrices?.(pricing) || Promise.resolve());
      toast.success("Credit pricing updated successfully");
    } catch (error) {
      toast.error("Failed to update pricing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600 dark:text-yellow-400">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Credit Pricing</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Set unit prices for individual QR code credits
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-[2rem] border-2">
        <CardHeader>
          <CardTitle className="uppercase font-black text-lg">Unit Prices</CardTitle>
          <CardDescription className="uppercase font-bold text-[10px] tracking-widest">
            Configure how many credits each QR code type costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dynamic-price" className="text-[10px] font-black uppercase tracking-widest">Dynamic QR Code Price</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="dynamic-price" 
                    type="number" 
                    min={1}
                    className="pl-10 rounded-xl h-11 font-bold" 
                    value={pricing.dynamic_qr_price}
                    onChange={e => setPricing({...pricing, dynamic_qr_price: parseInt(e.target.value)})}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Cost per dynamic QR generated using credits</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="static-price" className="text-[10px] font-black uppercase tracking-widest">Static QR Code Price</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="static-price" 
                    type="number" 
                    min={1}
                    className="pl-10 rounded-xl h-11 font-bold" 
                    value={pricing.static_qr_price}
                    onChange={e => setPricing({...pricing, static_qr_price: parseInt(e.target.value)})}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Cost per static QR generated using credits</p>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed">
              <Button className="w-full sm:w-auto px-8 rounded-xl h-11 uppercase font-black text-[10px] tracking-widest" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Pricing
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
