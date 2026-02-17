"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";

export default function CheckoutAccountCreditPage() {
  return (
    <div className="container mx-auto py-10 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Account Credits</CardTitle>
          <CardDescription>Purchase credits to create more QR codes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[10, 20, 50, 100, 200, 500].map((amount) => (
              <Button key={amount} variant="outline" className="h-20 flex flex-col gap-1">
                <span className="text-2xl font-bold">${amount}</span>
                <span className="text-xs text-muted-foreground">Credits</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Custom Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input className="pl-7" type="number" min="5" placeholder="Enter amount" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <CreditCard className="h-6 w-6" />
                <span>Card</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Wallet className="h-6 w-6" />
                <span>PayPal</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">Proceed to Payment</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
