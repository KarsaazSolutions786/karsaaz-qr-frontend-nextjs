"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Globe } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AddDomainPage() {
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "connected" | "failed">("idle");

  const checkConnection = () => {
    setStatus("checking");
    // Simulate DNS check
    setTimeout(() => {
      setStatus(Math.random() > 0.5 ? "connected" : "failed");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Connect Custom Domain</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Domain</CardTitle>
          <CardDescription>
            Use your own domain for short URLs (e.g., qr.yourbrand.com).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="domain" 
                  placeholder="qr.example.com" 
                  className="pl-9"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
              <Button onClick={checkConnection} disabled={!domain || status === "checking"}>
                {status === "checking" ? "Checking..." : "Verify DNS"}
              </Button>
            </div>
          </div>

          {status === "connected" && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Connected!</AlertTitle>
              <AlertDescription>
                Your domain is pointed correctly. You can now use it for your QR codes.
              </AlertDescription>
            </Alert>
          )}

          {status === "failed" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                We couldn't verify the DNS records. Please ensure you have added the CNAME record.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-semibold">DNS Configuration</p>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-mono">CNAME</span>
              <span className="text-muted-foreground">Host:</span>
              <span className="font-mono">{domain.split('.')[0] || "qr"}</span>
              <span className="text-muted-foreground">Value:</span>
              <span className="font-mono">cname.karsaaz-qr.com</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button disabled={status !== "connected"}>Add Domain</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
