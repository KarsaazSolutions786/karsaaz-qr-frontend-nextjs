"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfUsePage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center gap-3 mb-8">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
            </div>
            <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6 space-y-4">
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p>By accessing and using Karsaaz QR services, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
                    <h2 className="text-xl font-semibold">2. Service Description</h2>
                    <p>Karsaaz QR provides QR code generation, management, and analytics services. Features vary based on your subscription plan.</p>
                    <h2 className="text-xl font-semibold">3. User Accounts</h2>
                    <p>You are responsible for maintaining the security of your account. You must not share your login credentials.</p>
                    <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
                    <p>You agree not to use our services for illegal, harmful, or abusive purposes. QR codes linking to malicious content will be removed.</p>
                    <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
                    <p>The QR codes you generate are your property. Our platform, branding, and technology remain our intellectual property.</p>
                    <h2 className="text-xl font-semibold">6. Payment & Subscriptions</h2>
                    <p>Subscription fees are charged according to your selected plan. Refunds are handled on a case-by-case basis.</p>
                    <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
                    <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
                    <h2 className="text-xl font-semibold">8. Termination</h2>
                    <p>We reserve the right to terminate accounts that violate these terms. You may cancel your account at any time.</p>
                </CardContent>
            </Card>
        </div>
    );
}
