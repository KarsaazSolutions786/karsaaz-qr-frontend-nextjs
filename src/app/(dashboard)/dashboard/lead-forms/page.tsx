"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import leadFormService from "@/services/lead-form.service";
import { FormInput } from "lucide-react";

export default function AdminLeadFormsPage() {
    return (
        <AdminCrudPage
            title="Lead Forms"
            description="Manage lead capture forms for QR code landing pages."
            icon={<FormInput className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "submissions_count", label: "Submissions" },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={leadFormService.getAll}
            deleteFn={leadFormService.delete}
        />
    );
}
