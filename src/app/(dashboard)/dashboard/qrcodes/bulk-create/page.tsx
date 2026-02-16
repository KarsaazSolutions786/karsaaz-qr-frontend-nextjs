"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allQRTypes } from "@/data/qr-types";
import { useAuth } from "@/hooks/use-auth";
import { folderService } from "@/services/folder.service";
import { qrCodeService } from "@/services/qr.service";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileUp,
  History,
  Loader2,
  PlayCircle,
  Plus,
  Trash2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BulkCreatePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("create");
  const [selectedType, setSelectedType] = useState("url");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [folders, setFolders] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History states
  const [instances, setInstances] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (userId) fetchFolders();
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, userId]);

  // Poll for updates if there are running instances
  useEffect(() => {
    let interval: any;
    if (activeTab === "history" && instances.some(i => i.status === "running" || i.status === "pending")) {
      interval = setInterval(fetchHistory, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab, instances]);

  const fetchFolders = async () => {
    if (!userId) return;
    try {
      const data = await folderService.getFolders(userId);
      setFolders(data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch folders", error);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await qrCodeService.getBulkInstances();
      setInstances(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("operation_creation_input", file);
      formData.append("type", selectedType);
      if (selectedFolder !== "all") {
        formData.append("folder_id", selectedFolder);
      }

      // Note: The specific endpoint for CSV create might vary base on the base-operation.js
      // In qrcg-import-url-qrcodes.js it uses createRoute() -> bulk-operations/${type}/create
      await qrCodeService.runBulkOperation("import-url-qrcodes", formData);
      toast.success("Bulk job started successfully");
      setFile(null);
      setActiveTab("history");
    } catch (error) {
      console.error("Bulk creation failed", error);
      toast.error("Failed to start bulk creation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteInstance = async (id: number) => {
    if (!confirm("Are you sure you want to delete this historical record?")) return;
    try {
      await qrCodeService.deleteBulkInstance(id);
      toast.success("Record deleted");
      fetchHistory();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
      case "running":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none flex items-center gap-1 animate-pulse"><PlayCircle className="h-3 w-3" /> Running</Badge>;
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Pending</Badge>;
      case "error":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground mt-1">Efficiently create and manage multiple QR codes at once.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Bulk Creation</CardTitle>
                  <CardDescription>Upload a CSV file to create multiple QR codes automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">QR Category</label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {allQRTypes.filter(t => t.category === "Dynamic").map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Add to Folder</label>
                        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select folder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Default Folder</SelectItem>
                            {folders.map(f => (
                              <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">CSV Data File</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer ${file ? 'border-blue-500 bg-blue-50/30' : 'border-muted'}`}
                        onClick={() => document.getElementById('csv-upload')?.click()}
                      >
                        <input
                          type="file"
                          id="csv-upload"
                          className="hidden"
                          accept=".csv"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                          <FileUp className="h-6 w-6" />
                        </div>
                        {file ? (
                          <p className="font-medium text-blue-600">{file.name}</p>
                        ) : (
                          <>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground mt-1">Only .csv files are supported</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" size="lg" disabled={isSubmitting || !file} className="px-8">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Start Bulk Creation
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1 space-y-6">
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm opacity-90">
                  <p>1. Download the sample CSV file to see the required format.</p>
                  <p>2. Prepare your data with the appropriate columns for your chosen QR type.</p>
                  <p>3. Upload the file and choose your target folder.</p>
                  <p>4. The process will run in the background. Track progress in the History tab.</p>
                  <Button variant="secondary" className="w-full mt-4" asChild>
                    <a href="/api/bulk-operations/import-url-qrcodes/csv-sample" download>
                      <Download className="mr-2 h-4 w-4" /> Download Sample
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CSV Structure</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Column</span>
                    <span className="text-muted-foreground">Type</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="text-muted-foreground">Required</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target URL</span>
                    <span className="text-muted-foreground">Required</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Folder ID</span>
                    <span className="text-muted-foreground">Optional</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Operation History</CardTitle>
                <CardDescription>View and manage your previous bulk creation jobs.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loadingHistory}>
                {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto border rounded-md">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Operation Name</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {instances.length > 0 ? instances.map((instance) => (
                      <tr key={instance.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 font-medium">#{instance.id}</td>
                        <td className="px-4 py-4">{instance.name || "Bulk Import"}</td>
                        <td className="px-4 py-4">{getStatusBadge(instance.status)}</td>
                        <td className="px-4 py-4">
                          <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: instance.progress || "0%" }}
                            />
                          </div>
                          <span className="text-[10px] mt-1 block">{instance.progress}</span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                          {new Date(instance.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Delete record" onClick={() => deleteInstance(instance.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground italic">
                          No bulk operations found. Start one in the Create tab.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
