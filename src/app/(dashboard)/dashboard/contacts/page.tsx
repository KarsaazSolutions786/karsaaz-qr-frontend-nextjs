"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import contactService from "@/services/contact.service";
import { Contact } from "lucide-react";

export default function AdminContactsPage() {
    return (
        <AdminCrudPage
            title="Contacts"
            description="View contact form submissions."
            icon={<Contact className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "subject", label: "Subject" },
                { key: "created_at", label: "Date" },
            ]}
            fetchFn={contactService.getAll}
            deleteFn={contactService.delete}
        />
    );
}
