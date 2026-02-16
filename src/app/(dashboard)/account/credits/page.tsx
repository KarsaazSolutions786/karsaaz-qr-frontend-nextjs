"use client";

import CreditPurchaseFlow from "@/components/checkout/CreditPurchaseFlow";

export default function CreditsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Account Credits</h1>
            <CreditPurchaseFlow />
        </div>
    );
}
