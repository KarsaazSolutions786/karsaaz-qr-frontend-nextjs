"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import qrCodeService from "@/services/qr.service";
import {
  Archive,
  BarChart2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Square,
  Trash
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QRCodesPage() {
  const [qrcodes, setQrcodes] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  const { isLoading, call } = useApi();

  const fetchQRCodes = async (page = 1) => {
    try {
      const response = await call(() => qrCodeService.getAll({ page, keyword: search }));
      setQrcodes(response.data || []);
      setTotalPage(response.last_page || 1);
      setCurrentPage(response.current_page || 1);
    } catch (error) {
      // Error handled by useApi
    }
  };

  useEffect(() => {
    fetchQRCodes(currentPage);
  }, [currentPage]);

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

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    toast.promise(Promise.all(Array.from(selectedIds).map(id => qrCodeService.archive(id))), {
      loading: 'Archiving...',
      success: 'QR codes archived',
      error: 'Failed to archive some codes',
    });
    setSelectedIds(new Set());
    fetchQRCodes(currentPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground text-sm">
            Total of {qrcodes.length} QR codes in this page.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 dark:bg-blue-900/20">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{selectedIds.size} selected</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleBulkArchive}>
                <Archive className="h-3 w-3 mr-1" /> Archive
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

      <Card>
        <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQRCodes(1)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchQRCodes(1)}>
            Search
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.size === qrcodes.length && qrcodes.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scans</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
              ) : qrcodes.length > 0 ? (
                qrcodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <button onClick={() => toggleSelect(qr.id.toString())}>
                        {selectedIds.has(qr.id.toString()) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qr.short_url}`} alt="QR" className="h-8 w-8" />
                        </div>
                        {qr.name}
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs uppercase bg-gray-100 px-2 py-0.5 rounded">{qr.type}</span></TableCell>
                    <TableCell>{qr.scans_count}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(qr.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/qrcodes/${qr.id}/stats`}><BarChart2 className="h-4 w-4 mr-2" /> Stats</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/qrcodes/edit/${qr.id}`}><Edit className="h-4 w-4 mr-2" /> Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => call(() => qrCodeService.duplicate(qr.id))}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => call(() => qrCodeService.delete(qr.id))}>
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No QR codes found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}