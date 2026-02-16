"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import domainService from "@/services/domain.service";
import { Globe } from "lucide-react";

export default function AdminDomainsPage() {
    return (
        <AdminCrudPage
            title="Custom Domains"
            description="Manage custom domains for QR code short URLs."
            icon={<Globe className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Domain" },
                {
                    key: "is_verified", label: "Status", render: (v) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {v ? "Verified" : "Pending"}
                        </span>
                    )
                },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={domainService.getAll}
            deleteFn={domainService.delete}
        />
    );
}
