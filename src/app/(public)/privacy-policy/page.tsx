"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            </div>
            <Card>
                <CardContent className="prose dark:prose-invert max-w-none pt-6 space-y-4">
                    <p className="text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                    <h2 className="text-xl font-semibold">1. Information We Collect</h2>
                    <p>We collect information you provide directly, including name, email, and payment details when you create an account or subscribe to our services.</p>
                    <h2 className="text-xl font-semibold">2. How We Use Your Data</h2>
                    <p>Your data is used to provide, maintain, and improve our QR code generation services, process payments, and communicate with you about your account.</p>
                    <h2 className="text-xl font-semibold">3. Data Security</h2>
                    <p>We implement industry-standard security measures to protect your data, including encryption, secure storage, and regular security audits.</p>
                    <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
                    <p>We use third-party services for payment processing (Stripe) and analytics. These services have their own privacy policies.</p>
                    <h2 className="text-xl font-semibold">5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal data. Contact our support team for any data-related requests.</p>
                    <h2 className="text-xl font-semibold">6. Cookies</h2>
                    <p>We use cookies for authentication and to improve user experience. You can manage cookie preferences in your browser settings.</p>
                    <h2 className="text-xl font-semibold">7. Contact Us</h2>
                    <p>For any privacy-related questions, please contact us at privacy@karsaazqr.com.</p>
                </CardContent>
            </Card>
        </div>
    );
}
