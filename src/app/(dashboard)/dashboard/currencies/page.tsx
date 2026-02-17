"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import currencyService from "@/services/currency.service";
import { DollarSign } from "lucide-react";

export default function AdminCurrenciesPage() {
    return (
        <AdminCrudPage
            title="Currencies"
            description="Manage supported currencies for billing."
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "code", label: "Code" },
                { key: "symbol", label: "Symbol" },
                { key: "is_default", label: "Default", render: (v: any) => v ? "✓" : "—" },
            ]}
            fetchFn={currencyService.getAll}
            deleteFn={currencyService.delete}
        />
    );
}
