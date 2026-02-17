"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ReportAbusePage() {
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Report Abuse</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Report</CardTitle>
          <CardDescription>
            Found a QR code violating our terms? Let us know.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>QR Code URL or ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search QR code..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason for Report</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scam">Phishing / Scam</SelectItem>
                <SelectItem value="malware">Malware / Virus</SelectItem>
                <SelectItem value="illegal">Illegal Content</SelectItem>
                <SelectItem value="copyright">Copyright Infringement</SelectItem>
                <SelectItem value="impersonation">Impersonation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Details</Label>
            <Textarea placeholder="Please provide more information about the violation..." rows={5} />
          </div>

          <div className="flex justify-end">
            <Button variant="destructive">Submit Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
