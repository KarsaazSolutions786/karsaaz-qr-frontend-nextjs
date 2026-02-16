"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import systemService from "../../../../../services/system.service";

const CACHE_TYPES = [
    { key: "application", label: "Application Cache", description: "Clears the application cache" },
    { key: "config", label: "Config Cache", description: "Clears the cached configuration" },
    { key: "route", label: "Route Cache", description: "Clears the route cache" },
    { key: "view", label: "View Cache", description: "Clears compiled view files" },
];

export default function SystemCachePage() {
    const [clearing, setClearing] = useState<string | null>(null);
    const [rebuilding, setRebuilding] = useState<string | null>(null);

    const handleClear = async (type: string) => {
        try {
            setClearing(type);
            await systemService.clearCache(type);
            toast.success(`${type} cache cleared successfully`);
        } catch { toast.error(`Failed to clear ${type} cache`); }
        finally { setClearing(null); }
    };

    const handleRebuild = async (type: string) => {
        try {
            setRebuilding(type);
            await systemService.rebuildCache(type);
            toast.success(`${type} cache rebuilt successfully`);
        } catch { toast.error(`Failed to rebuild ${type} cache`); }
        finally { setRebuilding(null); }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Cache Management</h1>
                    <p className="text-muted-foreground">Clear and rebuild application caches.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {CACHE_TYPES.map((cache) => (
                    <Card key={cache.key}>
                        <CardHeader>
                            <CardTitle className="text-base">{cache.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{cache.description}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleClear(cache.key)} disabled={clearing === cache.key}>
                                    {clearing === cache.key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    Clear
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleRebuild(cache.key)} disabled={rebuilding === cache.key}>
                                    {rebuilding === cache.key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                                    Rebuild
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
