"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import contentService from "@/services/content.service";
import { Languages } from "lucide-react";

export default function AdminTranslationsPage() {
    return (
        <AdminCrudPage
            title="Translations"
            description="Manage application language translations."
            icon={<Languages className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Language" },
                { key: "code", label: "Code" },
                { key: "is_default", label: "Default", render: (v: any) => v ? "✓" : "—" },
            ]}
            fetchFn={contentService.getTranslations}
            deleteFn={contentService.deleteTranslation}
        />
    );
}
