"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import contentService from "@/services/content.service";
import { cn } from "@/lib/utils";
import {
  Code,
  Edit,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PLACEMENT_OPTIONS = ["head", "body_start", "body_end"];

export default function CustomCodesPage() {
  const [codes, setCodes]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  // Create / Edit dialog
  const [formDialog, setFormDialog]     = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget]     = useState<any>(null);
  const [formName, setFormName]         = useState("");
  const [formCode, setFormCode]         = useState("");
  const [formPlacement, setFormPlacement] = useState("head");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await contentService.getCustomCodes({ search });
      const data = (res as any)?.data ?? res;
      setCodes(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch {
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCodes(); }, []);

  const openCreate = () => {
    setFormName("");
    setFormCode("");
    setFormPlacement("head");
    setEditTarget(null);
    setFormDialog("create");
  };

  const openEdit = (item: any) => {
    setFormName(item.name ?? "");
    setFormCode(item.code ?? item.content ?? "");
    setFormPlacement(item.placement ?? "head");
    setEditTarget(item);
    setFormDialog("edit");
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formCode.trim()) return;
    setFormSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        code: formCode.trim(),
        placement: formPlacement,
      };
      if (formDialog === "edit" && editTarget) {
        await contentService.updateCustomCode(editTarget.id, payload);
        toast.success("Custom code updated");
      } else {
        await contentService.createCustomCode(payload);
        toast.success("Custom code created");
      }
      setFormDialog(null);
      fetchCodes();
    } catch {
      toast.error("Failed to save custom code");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await contentService.deleteCustomCode(deleteTarget.id);
      toast.success("Custom code deleted");
      setDeleteTarget(null);
      fetchCodes();
    } catch {
      toast.error("Failed to delete custom code");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = codes.filter(c =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Custom Codes</h1>
          <p className="text-muted-foreground text-sm">Inject custom JavaScript or CSS into your pages.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCodes} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Code
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search custom codes..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchCodes()}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Code className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No custom codes yet. Add one to inject scripts or styles into your pages.
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(item => (
                <div key={item.id} className="flex items-start justify-between px-6 py-4 hover:bg-muted/40 transition-colors gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Code className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.placement && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium uppercase">
                            {item.placement}
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground truncate max-w-xs font-mono">
                          {(item.code ?? item.content ?? "").substring(0, 80)}
                          {(item.code ?? item.content ?? "").length > 80 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formDialog !== null} onClose={() => setFormDialog(null)}>
        <DialogHeader>
          <DialogTitle>{formDialog === "edit" ? "Edit Custom Code" : "Add Custom Code"}</DialogTitle>
          <DialogDescription>
            {formDialog === "edit"
              ? "Update this custom code snippet."
              : "Add a JavaScript or CSS snippet to inject into your pages."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Google Analytics"
              value={formName}
              onChange={e => setFormName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Placement</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={formPlacement}
              onChange={e => setFormPlacement(e.target.value)}
            >
              {PLACEMENT_OPTIONS.map(p => (
                <option key={p} value={p}>
                  {p === "head" ? "<head>" : p === "body_start" ? "<body> start" : "<body> end"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Code</Label>
            <textarea
              className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="<script>...</script> or <style>...</style>"
              value={formCode}
              onChange={e => setFormCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormDialog(null)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={formSubmitting || !formName.trim() || !formCode.trim()}>
            {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formDialog === "edit" ? "Save Changes" : "Add Code"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogHeader>
          <DialogTitle>Delete Custom Code</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
