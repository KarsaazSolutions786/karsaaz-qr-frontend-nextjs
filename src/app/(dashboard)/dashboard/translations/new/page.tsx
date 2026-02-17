"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewTranslationPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/translations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Translation</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Language Name</Label>
            <Input id="name" placeholder="French" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Locale Code</Label>
            <Input id="code" placeholder="fr" />
          </div>
          <div className="flex justify-end pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Add Translation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
