"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Confetti from "react-confetti"; // Consider installing this if not available, or just omit

export default function PaymentThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/qrcodes");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Mock Confetti - assumes library or just placeholder */}
      {windowSize.width > 0 && (
        <div className="absolute inset-0 pointer-events-none">
           {/* <Confetti width={windowSize.width} height={windowSize.height} /> */}
        </div>
      )}

      <Card className="w-full max-w-md text-center border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-300">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-green-700 dark:text-green-400">
            Thank you for your purchase. Your account has been upgraded.
          </p>
          
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
            <h3 className="font-semibold mb-2">Unlocked Features:</h3>
            <ul className="text-sm space-y-1 text-left inline-block">
              <li>✅ Unlimited Dynamic QR Codes</li>
              <li>✅ Advanced Analytics</li>
              <li>✅ Custom Domains</li>
              <li>✅ Vector Downloads</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push("/dashboard/qrcodes")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
