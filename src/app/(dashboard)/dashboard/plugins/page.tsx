"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import pluginService from "@/services/plugin.service";
import { Plug } from "lucide-react";

export default function AdminPluginsPage() {
    return (
        <AdminCrudPage
            title="Plugins"
            description="Manage installed plugins and extensions."
            icon={<Plug className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "version", label: "Version" },
                {
                    key: "is_active", label: "Status", render: (v) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {v ? "Active" : "Inactive"}
                        </span>
                    )
                },
            ]}
            fetchFn={pluginService.getInstalled}
            paginated={false}
        />
    );
}
