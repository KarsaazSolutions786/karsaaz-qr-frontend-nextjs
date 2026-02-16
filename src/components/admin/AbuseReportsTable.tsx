"use client";

import {
    Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import abuseReportService, { AbuseReport } from "@/services/abuse-report.service";

export default function AbuseReportsTable() {
    const [reports, setReports] = useState<AbuseReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Modals
    const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null);
    const [modalMode, setModalMode] = useState<'resolve' | 'dismiss' | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [processing, setProcessing] = useState(false);

    const fetchReports = async (page = 1) => {
        setLoading(true);
        try {
            const res = await abuseReportService.getAll({
                page,
                status: statusFilter === 'all' ? undefined : statusFilter
            });
            const data = res.data;
            setReports(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total
            });
        } catch (error) {
            console.error("Failed to load reports:", error);
            toast.error("Failed to load abuse reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(1);
    }, [statusFilter]);

    const handleAction = (report: AbuseReport, mode: 'resolve' | 'dismiss') => {
        setSelectedReport(report);
        setModalMode(mode);
        setAdminNotes("");
    };

    const confirmAction = async () => {
        if (!selectedReport || !modalMode) return;

        setProcessing(true);
        try {
            const status = modalMode === 'resolve' ? 'resolved' : 'dismissed';
            await abuseReportService.updateStatus(selectedReport.id, {
                status,
                admin_notes: adminNotes
            });

            toast.success(`Report marked as ${status}`);
            setModalMode(null);
            fetchReports(pagination.current_page);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update report status");
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
            case 'resolved': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
            case 'dismissed': return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Dismissed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex bg-muted p-1 rounded-lg">
                    {['pending', 'resolved', 'dismissed', 'all'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${statusFilter === status
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/50"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <Button variant="outline" size="sm" onClick={() => fetchReports(pagination.current_page)}>
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader className="p-4">
                    {/* Standard Table wrapping */}
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>QR Code</TableHead>
                                <TableHead>Reporter IP</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Loading reports...
                                    </TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No abuse reports found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {report.category || 'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate" title={report.details}>
                                                {report.details || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {report.qrcode ? (
                                                <a
                                                    href={`/dashboard/qrcodes?id=${report.qrcode.id}`}
                                                    target="_blank"
                                                    className="text-primary hover:underline flex items-center gap-1"
                                                >
                                                    #{report.qrcode.id} <Eye className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic">Deleted</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {report.reporter_ip || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(report.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {report.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                        onClick={() => handleAction(report, 'resolve')}
                                                    >
                                                        Resolve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-muted-foreground hover:bg-muted"
                                                        onClick={() => handleAction(report, 'dismiss')}
                                                    >
                                                        Dismiss
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Archived</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchReports(pagination.current_page - 1)}
                        disabled={pagination.current_page <= 1}
                    >
                        Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchReports(pagination.current_page + 1)}
                        disabled={pagination.current_page >= pagination.last_page}
                    >
                        Next
                    </Button>
                </div>
            </Card>

            {/* Action Modal */}
            <Dialog open={!!modalMode} onClose={() => setModalMode(null)}>
                <DialogHeader>
                    <DialogTitle>
                        {modalMode === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
                    </DialogTitle>
                    <DialogDescription>
                        {modalMode === 'resolve'
                            ? "Marking as RESOLVED implies action has been taken (e.g. banning user, disabling QR)."
                            : "Marking as DISMISSED implies this was a false alarm or spam."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                        <p><strong>Report:</strong> {selectedReport?.details}</p>
                        <p className="mt-1"><strong>Category:</strong> {selectedReport?.category}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Admin Notes</Label>
                        <Textarea
                            placeholder={modalMode === 'resolve' ? "e.g. 'Banned user for phishing'" : "Optional notes"}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setModalMode(null)}>Cancel</Button>
                    <Button
                        variant={modalMode === 'resolve' ? "default" : "destructive"}
                        onClick={confirmAction}
                        disabled={processing}
                    >
                        {processing ? "Processing..." : (modalMode === 'resolve' ? "Confirm Resolution" : "Confirm Dismissal")}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
