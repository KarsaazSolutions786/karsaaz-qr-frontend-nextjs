"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QRCode, qrCodeService } from "@/services/qr.service";
import { ArchiveRestore, Loader2, QrCode as QrCodeIcon, Search, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ArchivedQRCodesPage() {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArchivedQRCodes();
  }, []);

  const fetchArchivedQRCodes = async () => {
    setIsLoading(true);
    try {
      const response = await qrCodeService.getAll({
        search_archived: true,
        keyword: search || undefined,
      });

      if (response.data) {
        setQrcodes(response.data);
      } else {
        setQrcodes(response || []);
      }
    } catch (error) {
      console.error("Failed to fetch archived QR codes", error);
      toast.error("Failed to load archived QR codes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string | number) => {
    try {
      await qrCodeService.archive(id, false); // archived = false means restore
      toast.success("QR Code restored");
      fetchArchivedQRCodes();
    } catch (error) {
      toast.error("Failed to restore QR code");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to permanently delete this QR code?")) return;
    try {
      await qrCodeService.delete(id);
      toast.success("QR Code deleted");
      fetchArchivedQRCodes();
    } catch (error) {
      toast.error("Failed to delete QR code");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archived QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your archived QR codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search archived..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchArchivedQRCodes()}
            />
          </div>
          <Button variant="outline" onClick={fetchArchivedQRCodes}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : qrcodes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {qrcodes.map((qrcode) => (
            <Card key={qrcode.id} className="opacity-80 hover:opacity-100 transition-opacity">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold leading-none">
                    {qrcode.name}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{qrcode.type}</p>
                </div>
                <div className="h-12 w-12 bg-gray-50 border rounded flex items-center justify-center p-1 overflow-hidden">
                  {qrcode.simple_png_url ? (
                    <img src={qrcode.simple_png_url} alt="QR" className="h-full w-full object-contain" />
                  ) : (
                    <QrCodeIcon className="h-6 w-6 text-gray-200" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-[11px] text-muted-foreground mb-4">
                  Created on {qrcode.created_at ? new Date(qrcode.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => handleRestore(qrcode.id)}>
                    <ArchiveRestore className="mr-2 h-3.5 w-3.5" />
                    Restore
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(qrcode.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArchiveRestore className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No archived codes found</h3>
            <p className="text-sm text-muted-foreground mt-1">When you archive a QR code, it will appear here.</p>
            <Button variant="link" asChild className="mt-4">
              <Link href="/dashboard/qrcodes">View Active QR Codes</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
