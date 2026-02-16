"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { folderService } from "@/services/folder.service";
import {
    Folder,
    FolderPlus,
    MoreVertical,
    Pencil,
    Trash
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FolderType {
    id: string | number;
    name: string;
}

interface FolderListProps {
    selectedFolderId: string | number | null;
    onSelectFolder: (id: string | number | null) => void;
}

export function FolderList({ selectedFolderId, onSelectFolder }: FolderListProps) {
    const { user } = useAuth();
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [editingName, setEditingName] = useState("");

    const userId = user?.id;

    useEffect(() => {
        if (userId) fetchFolders();
    }, [userId]);

    const fetchFolders = async () => {
        if (!userId) return;
        try {
            const response = await folderService.getFolders(userId);
            // Handle Laravel response wrapper if present
            setFolders(response.data || response || []);
        } catch (error) {
            console.error("Failed to fetch folders", error);
        }
    };

    const handleCreate = async () => {
        if (!newFolderName.trim() || !userId) return;
        try {
            await folderService.createFolder(userId, newFolderName);
            setNewFolderName("");
            setIsCreating(false);
            fetchFolders();
            toast.success("Folder created");
        } catch (error) {
            toast.error("Failed to create folder");
        }
    };

    const handleUpdate = async (id: string | number) => {
        if (!editingName.trim() || !userId) return;
        try {
            await folderService.updateFolder(userId, id, editingName);
            setEditingId(null);
            fetchFolders();
            toast.success("Folder updated");
        } catch (error) {
            toast.error("Failed to update folder");
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this folder?") || !userId) return;
        try {
            await folderService.deleteFolder(userId, id);
            fetchFolders();
            if (selectedFolderId === id) onSelectFolder(null);
            toast.success("Folder deleted");
        } catch (error) {
            toast.error("Failed to delete folder");
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Folders
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsCreating(true)}
                >
                    <FolderPlus className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-1">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start font-normal",
                        selectedFolderId === null && "bg-gray-100 dark:bg-gray-800 font-semibold"
                    )}
                    onClick={() => onSelectFolder(null)}
                >
                    <Folder className="mr-2 h-4 w-4" />
                    All Items
                </Button>

                {folders.map((folder) => (
                    <div key={folder.id} className="group relative">
                        {editingId === folder.id ? (
                            <div className="flex items-center gap-1 p-1">
                                <Input
                                    className="h-8 text-sm"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleUpdate(folder.id)}
                                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(folder.id)}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start font-normal pr-8",
                                    selectedFolderId === folder.id && "bg-gray-100 dark:bg-gray-800 font-semibold"
                                )}
                                onClick={() => onSelectFolder(folder.id)}
                            >
                                <Folder className="mr-2 h-4 w-4" />
                                <span className="truncate">{folder.name}</span>
                            </Button>
                        )}

                        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditingId(folder.id);
                                            setEditingName(folder.name);
                                        }}
                                    >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDelete(folder.id)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}

                {isCreating && (
                    <div className="p-1">
                        <Input
                            placeholder="Folder name..."
                            className="h-8 text-sm"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onBlur={handleCreate}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
