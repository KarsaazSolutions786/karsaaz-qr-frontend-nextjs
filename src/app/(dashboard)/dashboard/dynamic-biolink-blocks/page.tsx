"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import contentService from "@/services/content.service";
import { LayoutList } from "lucide-react";

export default function AdminDynamicBiolinkBlocksPage() {
    return (
        <AdminCrudPage
            title="Dynamic Biolink Blocks"
            description="Manage dynamic content blocks for bio link pages."
            icon={<LayoutList className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "is_active", label: "Active", render: (v: any) => v ? "✓" : "—" },
            ]}
            fetchFn={contentService.getDynamicBiolinkBlocks}
            deleteFn={contentService.deleteDynamicBiolinkBlock}
            paginated={false}
        />
    );
}
