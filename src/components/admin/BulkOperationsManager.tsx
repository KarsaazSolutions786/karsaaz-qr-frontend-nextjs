"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/use-api";
import { qrCodeService } from "@/services/qr.service";
import { Download, FileDown, History, Loader2, Play, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function BulkOperationsManager() {
  const [instances, setInstances] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { call, isLoading } = useApi();

  const fetchInstances = useCallback(async () => {
    try {
      const data = await qrCodeService.getBulkInstances();
      setInstances(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch bulk instances", error);
    }
  }, []);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await call(() => qrCodeService.runBulkOperation("import-url-qrcodes", formData));
      toast.success("Bulk operation started successfully");
      setFile(null);
      fetchInstances();
    } catch (error) {
      toast.error("Failed to start bulk operation");
    }
  };

  const handleRerun = async (id: string | number) => {
    try {
      await call(() => qrCodeService.rerunBulkInstance(id));
      toast.success("Operation re-run started");
      fetchInstances();
    } catch (error) {
      toast.error("Failed to re-run operation");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await call(() => qrCodeService.deleteBulkInstance(id));
      toast.success("Record deleted");
      fetchInstances();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const handleExportZip = async (id: string | number) => {
    try {
      const url = await qrCodeService.exportBulkZip(id);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to generate ZIP");
    }
  };

  const handleDownloadSample = async () => {
    try {
      const url = await qrCodeService.getBulkCsvSample("import-url-qrcodes");
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to download sample");
    }
  };

  return (
    <Tabs defaultValue="import" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="import">
          <Upload className="h-4 w-4 mr-2" /> Import
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-2" /> History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-[2rem] border-2">
            <CardHeader>
              <CardTitle className="uppercase font-black text-lg">Upload CSV</CardTitle>
              <CardDescription className="uppercase font-bold text-[10px] tracking-widest">
                Create multiple QR codes at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file" className="text-[10px] font-black uppercase tracking-widest">Select File</Label>
                  <Input 
                    id="csv-file" 
                    type="file" 
                    accept=".csv" 
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="rounded-xl"
                  />
                </div>
                <Button className="w-full rounded-xl h-11 uppercase font-black text-[10px] tracking-widest" disabled={!file || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Process Import
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-2 bg-muted/20 border-dashed">
            <CardHeader>
              <CardTitle className="uppercase font-black text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground space-y-2">
                <p>1. Download the sample CSV template below.</p>
                <p>2. Add your data following the columns provided.</p>
                <p>3. Supported variables: [QRCODE_SLUG], [QRCODE_ID].</p>
              </div>
              <Button variant="outline" className="w-full rounded-xl border-2 uppercase font-black text-[10px] tracking-widest" onClick={handleDownloadSample}>
                <FileDown className="h-4 w-4 mr-2" /> Download Sample CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="history">
        <Card className="rounded-[2rem] border-2 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="uppercase font-black text-lg">Operation History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Name / ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest p-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground uppercase font-bold text-[10px] tracking-widest">
                      No bulk operations found
                    </TableCell>
                  </TableRow>
                ) : (
                  instances.map((op) => (
                    <TableRow key={op.id}>
                      <TableCell className="p-4">
                        <div className="font-bold">{op.name || `Operation #${op.id}`}</div>
                        <div className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">ID: {op.id}</div>
                      </TableCell>
                      <TableCell className="p-4 text-xs font-medium">
                        {new Date(op.created_at || op.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                          op.status === "completed" ? "bg-green-50 text-green-600 border-green-100" : 
                          op.status === "failed" ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {op.status || "Processing"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleRerun(op.id)} title="Re-Run">
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleExportZip(op.id)} title="Download ZIP">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500" onClick={() => handleDelete(op.id)} title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
