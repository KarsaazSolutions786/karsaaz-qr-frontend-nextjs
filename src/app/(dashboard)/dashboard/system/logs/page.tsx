"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCcw, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const data = await systemService.getLogs();
            setLogs(Array.isArray(data) ? data : data?.data || []);
        } catch (error) {
            toast.error("Failed to load system logs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ScrollText className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
                        <p className="text-muted-foreground">View application logs and error reports.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={fetchLogs}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="max-h-[600px] overflow-y-auto font-mono text-xs p-4 bg-gray-950 text-green-400 rounded-b-lg">
                            {logs.length > 0 ? logs.map((log, i) => (
                                <div key={i} className="py-0.5 border-b border-gray-800 last:border-0">
                                    {typeof log === 'string' ? log : JSON.stringify(log)}
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center py-8">No logs available.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
