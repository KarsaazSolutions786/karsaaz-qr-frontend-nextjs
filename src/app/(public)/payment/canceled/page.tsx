"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCanceledPage() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    <CardTitle className="text-2xl mt-4">Payment Canceled</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Your payment was canceled. No charges were made. You can try again or contact support if you need help.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Link href="/pricing">
                            <Button className="w-full">View Plans</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
