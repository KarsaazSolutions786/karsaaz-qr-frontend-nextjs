"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import billingService from "@/services/billing.service";
import { CreditCard } from "lucide-react";

export default function AdminBillingPage() {
    return (
        <AdminCrudPage
            title="Billing & Subscriptions"
            description="Manage user subscriptions and billing records."
            icon={<CreditCard className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "plan_id", label: "Plan" },
                {
                    key: "status", label: "Status", render: (v: any) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v}</span>
                    )
                },
                { key: "expires_at", label: "Expires" },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={billingService.getSubscriptions}
            deleteFn={billingService.deleteSubscription}
        />
    );
}
