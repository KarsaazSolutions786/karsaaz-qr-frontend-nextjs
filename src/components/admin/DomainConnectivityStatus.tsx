"use client";

import React, { useEffect, useState } from "react";
import { domainService, Domain } from "@/services/domain.service";
import { AlertOctagon, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DomainConnectivityStatusProps {
    domainId: string | number;
    shouldRenderApplicationAccessError?: boolean;
    onSuccess?: (domain: Domain) => void;
}

export function DomainConnectivityStatus({
    domainId,
    shouldRenderApplicationAccessError = true,
    onSuccess
}: DomainConnectivityStatusProps) {
    const [loading, setLoading] = useState(false);
    const [domain, setDomain] = useState<Domain | null>(null);
    const [connectivity, setConnectivity] = useState<{
        applicationIsAccessible: boolean;
        dnsIsConfigured: boolean;
        dnsCurrentValue: string | null;
    } | null>(null);

    const refresh = useCallback(async () => {
        if (!domainId) return;
        setLoading(true);
        try {
            const [domainData, connectivityData] = await Promise.all([
                domainService.getOne(domainId),
                domainService.checkConnectivity(domainId)
            ]);
            setDomain(domainData);
            setConnectivity(connectivityData);

            if (connectivityData.applicationIsAccessible && connectivityData.dnsIsConfigured) {
                if (onSuccess) onSuccess(domainData);
            }
        } catch (_error: unknown) { // Handle error as unknown
            console.error("Failed to check connectivity", _error);
        } finally {
            setLoading(false);
        }
    }, [domainId, onSuccess]);

    useEffect(() => {
        refresh();
    }, [domainId, refresh]);

    const getApplicationHost = () => {
        if (typeof window === "undefined") return "";
        return window.location.hostname;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checking domain connectivity...</p>
            </div>
        );
    }

    if (!connectivity || !domain) return null;

    const { applicationIsAccessible, dnsIsConfigured, dnsCurrentValue } = connectivity;

    return (
        <div className="space-y-4 relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-0 right-0 h-8 w-8" 
                onClick={refresh}
                disabled={loading}
            >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {(!dnsIsConfigured && !applicationIsAccessible) && (
                <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 p-6 rounded-3xl flex gap-4 animate-in fade-in zoom-in-95">
                    <AlertOctagon className="h-6 w-6 text-red-600 shrink-0" />
                    <div className="space-y-3">
                        <h5 className="text-sm font-black uppercase tracking-tight text-red-900 dark:text-red-400">DNS record not found</h5>
                        <p className="text-xs font-medium text-red-800/70 dark:text-red-400/70 leading-relaxed">
                            Add the following CNAME Record in your domain registrar control panel.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="bg-white dark:bg-zinc-950 px-3 py-2 rounded-xl shadow-sm border border-red-100 dark:border-red-900/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Type</span>
                                <span className="text-xs font-bold">CNAME</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-950 px-3 py-2 rounded-xl shadow-sm border border-red-100 dark:border-red-900/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Value</span>
                                <span className="text-xs font-bold">{getApplicationHost()}</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-950 px-3 py-2 rounded-xl shadow-sm border border-red-100 dark:border-red-900/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Current</span>
                                <span className="text-xs font-bold text-red-600">{dnsCurrentValue || "No Record Found"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(!applicationIsAccessible && shouldRenderApplicationAccessError && dnsIsConfigured) && (
                <div className="bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-100 dark:border-orange-900/30 p-6 rounded-3xl flex gap-4 animate-in fade-in zoom-in-95">
                    <AlertOctagon className="h-6 w-6 text-orange-600 shrink-0" />
                    <div className="space-y-3">
                        <h5 className="text-sm font-black uppercase tracking-tight text-orange-900 dark:text-orange-400">Application is not accessible</h5>
                        <p className="text-xs font-medium text-orange-800/70 dark:text-orange-400/70 leading-relaxed">
                            Add the following virtual host in your server configuration. If you are using cPanel, create a new addon domain for:
                        </p>
                        <div className="bg-white dark:bg-zinc-950 px-4 py-2 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/20 inline-block">
                            <span className="text-xs font-black font-mono">{domain.name}</span>
                        </div>
                    </div>
                </div>
            )}

            {(applicationIsAccessible && dnsIsConfigured) && (
                <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-100 dark:border-green-900/30 p-6 rounded-3xl flex gap-4 animate-in fade-in zoom-in-95">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div className="space-y-1">
                        <h5 className="text-sm font-black uppercase tracking-tight text-green-900 dark:text-green-400">Domain is connected</h5>
                        <p className="text-xs font-medium text-green-800/70 dark:text-green-400/70">
                            CNAME Record is configured properly and application is accessible.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
