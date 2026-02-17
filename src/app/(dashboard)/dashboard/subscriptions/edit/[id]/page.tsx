"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/subscriptions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Subscription #{id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="user">User Email</Label>
            <Input id="user" type="email" defaultValue="user@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plan">Plan ID</Label>
            <Input id="plan" defaultValue="plan_123" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" defaultValue="active" />
          </div>
          <div className="flex justify-end pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Update Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
