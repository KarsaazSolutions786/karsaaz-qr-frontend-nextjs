"use client";

import AbuseReportsTable from "@/components/admin/AbuseReportsTable";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AbuseReportsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const isSuperAdmin = user?.roles?.some((r: { name: string; super_admin?: boolean }) => r.name === "Super Admin" || r.name === "Admin" || r.super_admin) || false;

    useEffect(() => {
        if (mounted && user && !isSuperAdmin) {
            router.push("/dashboard");
        }
    }, [mounted, user, isSuperAdmin, router]);

    if (!mounted || !user) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    }

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Abuse Reports</h1>
            </div>
            <AbuseReportsTable />
        </div>
    );
}
