"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import templateService from "@/services/template.service";
import { Palette } from "lucide-react";

export default function AdminTemplatesPage() {
    return (
        <AdminCrudPage
            title="QR Templates"
            description="Manage QR code design templates."
            icon={<Palette className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "is_public", label: "Public", render: (v) => v ? "✓" : "—" },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={templateService.getTemplates}
            deleteFn={templateService.deleteTemplate}
        />
    );
}
