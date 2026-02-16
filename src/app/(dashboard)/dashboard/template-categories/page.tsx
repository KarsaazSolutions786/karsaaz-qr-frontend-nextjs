"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import templateService from "@/services/template.service";
import { Tag } from "lucide-react";

export default function AdminTemplateCategoriesPage() {
    return (
        <AdminCrudPage
            title="Template Categories"
            description="Organize QR code templates into categories."
            icon={<Tag className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "slug", label: "Slug" },
                { key: "templates_count", label: "Templates" },
            ]}
            fetchFn={templateService.getCategories}
            deleteFn={templateService.deleteCategory}
            paginated={false}
        />
    );
}
