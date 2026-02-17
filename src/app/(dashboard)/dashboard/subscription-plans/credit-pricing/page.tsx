"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function CreditPricingPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Credit Pricing</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pay-Per-QR Pricing</CardTitle>
          <CardDescription>
            Configure prices for individual QR code credits (used when not in subscription mode).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="static-price">Static QR Price ($)</Label>
              <Input id="static-price" type="number" min="0" step="0.01" defaultValue="5.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dynamic-price">Dynamic QR Price ($)</Label>
              <Input id="dynamic-price" type="number" min="0" step="0.01" defaultValue="10.00" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Prices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
