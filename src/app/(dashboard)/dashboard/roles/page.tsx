"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import roleService, { Role } from "@/services/role.service";
import permissionService from "@/services/permission.service";
import { cn } from "@/lib/utils";
import {
  Edit,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles]           = useState<Role[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  const [permissions, setPermissions] = useState<any[]>([]);

  // Create / Edit dialog
  const [formDialog, setFormDialog]   = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget]   = useState<Role | null>(null);
  const [formName, setFormName]       = useState("");
  const [formHomePage, setFormHomePage] = useState("");
  const [formPerms, setFormPerms]     = useState<Set<string | number>>(new Set());
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await roleService.getAll({ search });
      const data = (res as any)?.data ?? res;
      setRoles(Array.isArray(data) ? data : []);
    } catch {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await permissionService.getAll();
      const data = (res as any)?.data ?? res;
      setPermissions(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const openCreate = () => {
    setFormName("");
    setFormHomePage("");
    setFormPerms(new Set());
    setEditTarget(null);
    setFormDialog("create");
  };

  const openEdit = (role: Role) => {
    setFormName(role.name);
    setFormHomePage(role.home_page ?? "");
    setFormPerms(new Set(role.permissions?.map(p => p.id) ?? []));
    setEditTarget(role);
    setFormDialog("edit");
  };

  const togglePerm = (id: string | number) => {
    setFormPerms(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    setFormSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        home_page: formHomePage.trim(),
        permissions: Array.from(formPerms),
      };
      if (formDialog === "edit" && editTarget) {
        await roleService.update(editTarget.id, payload);
        toast.success("Role updated");
      } else {
        await roleService.create(payload);
        toast.success("Role created");
      }
      setFormDialog(null);
      fetchRoles();
    } catch {
      toast.error("Failed to save role");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await roleService.delete(deleteTarget.id);
      toast.success("Role deleted");
      setDeleteTarget(null);
      fetchRoles();
    } catch {
      toast.error("Failed to delete role");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground text-sm">Manage admin roles and their permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchRoles} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Role
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchRoles()}
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
              <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No roles found.
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(role => (
                <div key={role.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {role.name}
                        {role.super_admin && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Super Admin
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {role.permissions?.length ?? 0} permission{(role.permissions?.length ?? 0) !== 1 ? "s" : ""}
                        {role.home_page && <span className="ml-2">· Home: {role.home_page}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(role)}
                      disabled={role.super_admin}
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
          <DialogTitle>{formDialog === "edit" ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {formDialog === "edit" ? "Update this role's name and permissions." : "Define a new role with a set of permissions."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Role Name</Label>
            <Input
              placeholder="e.g. Editor"
              value={formName}
              onChange={e => setFormName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Home Page (optional)</Label>
            <Input
              placeholder="e.g. /dashboard"
              value={formHomePage}
              onChange={e => setFormHomePage(e.target.value)}
            />
          </div>
          {permissions.length > 0 && (
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-1.5">
                {permissions.map(p => (
                  <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5">
                    <input
                      type="checkbox"
                      checked={formPerms.has(p.id)}
                      onChange={() => togglePerm(p.id)}
                      className="rounded"
                    />
                    <span className="truncate">{p.name ?? p.slug}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{formPerms.size} permission{formPerms.size !== 1 ? "s" : ""} selected</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormDialog(null)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={formSubmitting || !formName.trim()}>
            {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formDialog === "edit" ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role "{deleteTarget?.name}"? This action cannot be undone.
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
