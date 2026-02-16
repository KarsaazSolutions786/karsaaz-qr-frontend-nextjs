"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import folderService, { Folder as FolderType } from "@/services/folder.service";
import {
  Edit2,
  Folder,
  MoreVertical,
  Plus,
  QrCode,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FoldersPage() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [search, setSearch] = useState("");
  const { isLoading, call } = useApi();

  const fetchFolders = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await call(() => folderService.getFolders(user.id!));
      setFolders(response.data || []);
    } catch (_) { }
  }, [user, call]); // Changed user?.id to user

  useEffect(() => {
    requestAnimationFrame(() => { // Wrap in requestAnimationFrame
      fetchFolders();
    });
  }, [fetchFolders]);

  const handleCreate = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    try {
      if (user?.id) {
        await call(() => folderService.createFolder(user.id, name));
        toast.success("Folder created");
        fetchFolders();
      }
    } catch (_) { }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure? QR codes inside will not be deleted.")) return;
    try {
      if (user?.id) {
        await call(() => folderService.deleteFolder(user.id, id));
        toast.success("Folder deleted");
        fetchFolders();
      }
    } catch (_) { }
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Folders</h1>
          <p className="text-muted-foreground text-sm">Organize your QR projects.</p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Folder
        </Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-32 rounded-lg bg-gray-100 animate-pulse" />)
        ) : filteredFolders.length > 0 ? (
          filteredFolders.map((folder) => (
            <Card key={folder.id} className="hover:border-blue-500 transition-all group">
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-900/30">
                  <Folder className="h-5 w-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit2 className="h-4 w-4 mr-2" /> Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(folder.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardTitle className="text-base truncate">{folder.name}</CardTitle>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <QrCode className="h-3 w-3 mr-1" /> {folder.qrcodes_count || 0} QR codes
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <Folder className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">No folders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}