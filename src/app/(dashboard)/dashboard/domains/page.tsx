"use client";

import { DomainConnectivityStatus } from "@/components/admin/DomainConnectivityStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import domainService, { Domain } from "@/services/domain.service";
import { Globe, HelpCircle, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDomainId, setSelectedDomainId] = useState<string | number | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newDomain, setNewDomain] = useState("");
    const { isLoading: isSubmitting, call } = useApi();

    const fetchDomains = async () => {
        setLoading(true);
        try {
            const response = await domainService.getMyDomains();
            setDomains(response || []);
        } catch {
            toast.error("Failed to fetch domains");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleAddDomain = async () => {
        if (!newDomain.trim()) return;
        try {
            await call(() => domainService.create({ name: newDomain }));
            toast.success("Domain added successfully");
            setNewDomain("");
            setIsAddOpen(false);
            fetchDomains();
        } catch {
            toast.error("Failed to add domain");
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this domain? all printed QR codes that use this domain won't work in future!")) return;
        try {
            await domainService.delete(id);
            toast.success("Domain deleted");
            fetchDomains();
        } catch {
            toast.error("Failed to delete domain");
        }
    };

    const handleConnectivitySuccess = async (domain: Domain) => {
        if (domain.is_verified) return;
        try {
            // Update status if needed or just refresh
            await domainService.updateStatus(domain.id, { status: 'in-progress' });
            fetchDomains();
        } catch {
            // ignore
        }
    };

    const getHost = () => {
        if (typeof window === "undefined") return "";
        return window.location.hostname;
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                        <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Custom Domains</h1>
                        <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">White-label your high-fidelity QR codes</p>
                    </div>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none uppercase font-black text-[10px] tracking-widest px-6 h-11">
                    <Plus className="mr-2 h-4 w-4" /> Add Domain
                </Button>
            </div>

            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/20 rounded-[2.5rem] overflow-hidden shadow-sm">
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-200">Integration Blueprint</h3>
                    </div>
                    <p className="text-xs font-medium text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
                        Serve dynamic QR codes from your own domain to increase trust and conversion rates. 
                        Add a <strong className="text-blue-900 dark:text-blue-100">CNAME Record</strong> with your registrar pointing to <code className="bg-white dark:bg-zinc-950 px-2 py-0.5 rounded font-black text-blue-600">{getHost() || "karsaazqr.com"}</code>.
                    </p>
                </CardContent>
            </Card>

            {selectedDomainId && (
                <DomainConnectivityStatus 
                    domainId={selectedDomainId} 
                    onSuccess={handleConnectivitySuccess}
                />
            )}

            <Card className="rounded-[2.5rem] border-2 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-zinc-900/50">
                        <TableRow className="hover:bg-transparent border-b-2">
                            <TableHead className="text-[10px] font-black uppercase tracking-widest px-8">Domain Identity</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Connection Status</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-right px-8">Operational Controls</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                        ) : domains.length > 0 ? (
                            domains.map((domain) => (
                                <TableRow key={domain.id} className="group transition-colors">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-black tracking-tight">{domain.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${domain.is_verified ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                            {domain.is_verified ? "Active" : "Pending Sync"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => setSelectedDomainId(domain.id)}
                                                className="h-9 px-4 rounded-xl border-2 uppercase font-black text-[9px] tracking-widest hover:bg-blue-50 hover:text-blue-700 transition-all"
                                            >
                                                <RefreshCw className="h-3 w-3 mr-2" /> Test Connection
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDelete(domain.id)}
                                                className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground uppercase font-bold text-xs tracking-widest">No domains configured pipeline</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} className="rounded-[2.5rem] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight">Deploy Custom Domain</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">Register your domain for white-label delivery</DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="domain" className="text-[10px] font-black uppercase tracking-widest px-1">Domain Hostname</Label>
                        <Input
                            id="domain"
                            placeholder="qr.your-brand.com"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            className="h-12 rounded-xl border-2 px-4 font-bold"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-xl h-11 border-2 uppercase font-black text-[10px] tracking-widest">Cancel</Button>
                    <Button 
                        onClick={handleAddDomain} 
                        disabled={isSubmitting || !newDomain.trim()}
                        className="flex-1 rounded-xl h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 uppercase font-black text-[10px] tracking-widest"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy Pipeline"}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
