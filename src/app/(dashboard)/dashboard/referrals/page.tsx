"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users, DollarSign, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ReferralPage() {
  const referralLink = "https://karsaazqr.com/ref/user123";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Referral Program</h1>
          <p className="text-muted-foreground">Invite your friends and earn commissions on their subscriptions.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Referrals</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Earnings</span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">$245.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold mt-2">$45.00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share your link</CardTitle>
          <CardDescription>Copy your unique referral link and share it with your network.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input readOnly value={referralLink} />
            <Button onClick={copyLink} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>View your earnings and referral activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-4 font-medium text-muted-foreground">User</th>
                  <th className="p-4 font-medium text-muted-foreground">Plan</th>
                  <th className="p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="p-4 font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b last:border-0">
                  <td className="p-4">m***@gmail.com</td>
                  <td className="p-4">Pro Plan</td>
                  <td className="p-4">$15.00</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">Oct 20, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
