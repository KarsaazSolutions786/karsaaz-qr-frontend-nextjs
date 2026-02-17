"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentInvalidPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Optional: Auto redirect
          // router.push("/pricing"); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-red-800 dark:text-red-300">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-red-700 dark:text-red-400">
            We couldn't process your payment. No charges were made.
          </p>
          
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg text-left text-sm space-y-2">
            <p className="font-semibold">Possible reasons:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Insufficient funds</li>
              <li>Incorrect card details</li>
              <li>Bank declined transaction</li>
              <li>Network error</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/pricing" className="flex-1">
              <Button className="w-full" variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/account/support-tickets" className="flex-1">
              <Button className="w-full" variant="ghost">
                <HelpCircle className="mr-2 h-4 w-4" />
                Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
