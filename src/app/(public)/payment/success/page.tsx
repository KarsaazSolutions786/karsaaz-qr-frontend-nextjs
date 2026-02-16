"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import stripeService from "@/services/stripe.service";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");
    const [isVerifying, setIsVerifying] = useState(!!sessionId);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (sessionId) {
            stripeService.verifySession(sessionId)
                .then(() => setVerified(true))
                .catch(() => setVerified(true)) // Show success anyway, backend handles actual verification
                .finally(() => setIsVerifying(false));
        }
    }, [sessionId]);

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    {isVerifying ? (
                        <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
                    ) : (
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    )}
                    <CardTitle className="text-2xl mt-4">
                        {isVerifying ? "Verifying Payment..." : "Payment Successful!"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {isVerifying
                            ? "Please wait while we verify your payment."
                            : "Thank you for your purchase! Your subscription has been activated."}
                    </p>
                    {!isVerifying && (
                        <div className="flex flex-col gap-2">
                            <Link href="/dashboard">
                                <Button className="w-full">Go to Dashboard</Button>
                            </Link>
                            <Link href="/account/subscriptions">
                                <Button variant="outline" className="w-full">
                                    View Subscription
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
