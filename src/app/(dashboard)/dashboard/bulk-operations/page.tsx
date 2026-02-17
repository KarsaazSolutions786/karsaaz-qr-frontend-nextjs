"use client";

import { BulkOperationsManager } from "@/components/admin/BulkOperationsManager";
import { Layers } from "lucide-react";

export default function BulkOperationsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Bulk Operations</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Manage large scale QR code generation and imports
            </p>
          </div>
        </div>
      </div>

      <BulkOperationsManager />
    </div>
  );
}
