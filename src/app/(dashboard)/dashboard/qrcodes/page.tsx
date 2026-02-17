"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeRow } from "@/components/qr/QRCodeRow";
import { allQRTypes } from "@/data/qr-types";
import { useApi } from "@/hooks/use-api";
import { QRCode, qrCodeService } from "@/services/qr.service";
import {
  Archive,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  Loader2,
  Plus,
  Search,
  Square,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function QRCodesPage() {
  const router = useRouter();
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { isLoading, call } = useApi();
  const [transferDialog, setTransferDialog] = useState<QRCode | null>(null);
  const [transferUserId, setTransferUserId] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  const fetchQRCodes = useCallback(async (page = 1) => {
    try {
      const response = await call(() => qrCodeService.getAll({ 
        page, 
        keyword: search,
        qrcode_type: selectedType === "all" ? undefined : selectedType 
      }));
      setQrcodes(response.data || []);
      setTotalPage(response.last_page || 1);
    } catch {
      // Error handled by useApi
    }
  }, [call, search, selectedType]);

  useEffect(() => {
    fetchQRCodes(currentPage);
  }, [currentPage, fetchQRCodes]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === qrcodes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(qrcodes.map(qr => qr.id.toString())));
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferDialog || !transferUserId.trim()) return;
    setTransferLoading(true);
    try {
      await qrCodeService.changeOwner(transferDialog.id, transferUserId.trim());
      toast.success(`QR code transferred to user #${transferUserId}`);
      setTransferDialog(null);
      setTransferUserId("");
      fetchQRCodes(currentPage);
    } catch { toast.error("Failed to transfer ownership"); }
    finally { setTransferLoading(false); }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    toast.promise(Promise.all(Array.from(selectedIds).map(id => call(() => qrCodeService.archive(id)))), {
      loading: 'Archiving...',
      success: 'QR codes archived',
      error: 'Failed to archive some codes',
    });
    setSelectedIds(new Set());
    fetchQRCodes(currentPage);
  };

  const handleStatClick = (qr: QRCode) => {
    router.push(`/dashboard/qrcodes/${qr.id}/stats`);
  };

  const handleReviewsClick = (qr: QRCode) => {
    router.push(`/dashboard/qrcodes/${qr.id}/reviews`);
  };

  const handleEditClick = (qr: QRCode) => {
    router.push(`/dashboard/qrcodes/edit/${qr.id}`);
  };

  const handleDuplicateClick = async (qr: QRCode) => {
    await call(() => qrCodeService.duplicate(qr.id) as Promise<QRCode>);
    toast.success('QR code duplicated');
    fetchQRCodes(currentPage);
  };

  const handleTransferClick = (qr: QRCode) => {
    setTransferDialog(qr);
    setTransferUserId("");
  };

  const handleDeleteClick = async (qr: QRCode) => {
    if (confirm(`Are you sure you want to delete "${qr.name}"?`)) {
      await call(() => qrCodeService.delete(qr.id) as Promise<void>);
      toast.success('QR code deleted');
      fetchQRCodes(currentPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {qrcodes.length > 0 
              ? `${selectedIds.size} selected · ${qrcodes.length} total on this page`
              : 'No QR codes yet'}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selectedIds.size} selected</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs ml-2 hover:bg-blue-100 dark:hover:bg-blue-800/50" 
                onClick={handleBulkArchive}
              >
                <Archive className="h-3.5 w-3.5 mr-1" /> Archive
              </Button>
            </div>
          )}
          <Link href="/dashboard/qrcodes/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create QR
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-4 flex flex-col sm:flex-row items-center space-y-0 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search QR codes..."
              className="pl-10 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQRCodes(1)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {allQRTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchQRCodes(1)}>
            Search
          </Button>
        </CardHeader>

        {/* QR List */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Loading QR codes...</p>
            </div>
          ) : qrcodes.length > 0 ? (
            <>
              {/* Column Headers */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex-shrink-0 w-[20px]" />
                <div className="flex-shrink-0 w-[40px]" />
                <div className="flex-1">Name</div>
                <div className="flex-shrink-0 w-[100px]">Type</div>
                <div className="flex-shrink-0 w-[80px]">Status</div>
                <div className="flex-shrink-0 w-[70px] text-center">Scans</div>
                <div className="flex-shrink-0 w-[100px] text-right">Date</div>
                <div className="flex-shrink-0 w-[100px]" />
              </div>

              {/* Rows */}
              {qrcodes.map((qr) => (
                <QRCodeRow
                  key={qr.id}
                  qr={qr}
                  isSelected={selectedIds.has(qr.id.toString())}
                  onSelectChange={toggleSelect}
                  onStats={handleStatClick}
                  onReviews={handleReviewsClick}
                  onEdit={handleEditClick}
                  onDuplicate={handleDuplicateClick}
                  onTransfer={handleTransferClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-900/50 p-4 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No QR codes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search || selectedType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first QR code to get started'}
              </p>
              {!search && selectedType === 'all' && (
                <Link href="/dashboard/qrcodes/new">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create QR Code
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Page {currentPage}</span>
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-xs text-muted-foreground">
        <Zap className="h-4 w-4 flex-shrink-0" />
        <span>💡 Power user tip: Use keyboard shortcuts to navigate faster. Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs font-medium">Enter</kbd> to search</span>
      </div>

      {/* Transfer Ownership Dialog */}
      <Dialog open={transferDialog !== null} onOpenChange={() => setTransferDialog(null)}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer QR Code Ownership</DialogTitle>
          <DialogDescription>
            Transfer &quot;{transferDialog?.name}&quot; to another user. Enter the target user&apos;s ID.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            placeholder="Enter User ID"
            value={transferUserId}
            onChange={e => setTransferUserId(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setTransferDialog(null)}>Cancel</Button>
          <Button onClick={handleTransferOwnership} disabled={transferLoading || !transferUserId.trim()}>
            {transferLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Transfer
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
