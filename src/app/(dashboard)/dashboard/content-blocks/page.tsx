"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import contentService from "@/services/content.service";
import { LayoutGrid } from "lucide-react";

export default function AdminContentBlocksPage() {
    return (
        <AdminCrudPage
            title="Content Blocks"
            description="Manage reusable content blocks for pages."
            icon={<LayoutGrid className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={contentService.getContentBlocks}
            deleteFn={contentService.deleteContentBlock}
        />
    );
}
