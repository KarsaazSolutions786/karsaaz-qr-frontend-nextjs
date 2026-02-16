"use client";

import {
    Check,
    FolderOpen,
    MoreVertical,
    Trash2,
    UserPlus,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import folderService from "@/services/folder.service";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";

interface SubUser {
    id: string;
    name: string;
    email: string;
    subuser_folders?: { id: string; name: string }[];
}

interface Folder {
    id: string;
    name: string;
}

interface InviteFormValues {
    name: string;
    email: string;
    folder_ids: string[];
}

export default function TeamManagement() {
    const { user } = useAuthStore();
    const [subUsers, setSubUsers] = useState<SubUser[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // For updating folders
    const [editingUser, setEditingUser] = useState<SubUser | null>(null);
    const [isEditFoldersOpen, setIsEditFoldersOpen] = useState(false);
    const [selectedFoldersForEdit, setSelectedFoldersForEdit] = useState<string[]>([]);


    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<InviteFormValues>({
        defaultValues: {
            folder_ids: []
        }
    });

    const fetchData = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const [usersRes, foldersRes] = await Promise.all([
                userService.getSubUsers(user.id),
                folderService.getFolders(user.id)
            ]);
            setSubUsers(usersRes.data);
            setFolders(foldersRes.data);
        } catch (error) {
            console.error("Failed to fetch team data:", error);
            toast.error("Failed to load team data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const onInvite = async (data: InviteFormValues) => {
        if (!user?.id) return;
        try {
            // Check limits if needed (can be done here or rely on backend error)
            await userService.inviteSubUser(user.id, {
                name: data.name,
                email: data.email,
                folder_id: data.folder_ids
            });
            toast.success("Invitation sent successfully");
            setIsInviteOpen(false);
            reset();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to invite user");
        }
    };

    const onDeleteUser = async (subUserId: string) => {
        if (!user?.id) return;
        if (!confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;

        try {
            await userService.deleteSubUser(user.id, subUserId);
            toast.success("User removed successfully");
            setSubUsers(prev => prev.filter(u => u.id !== subUserId));
        } catch (error) {
            toast.error("Failed to remove user");
        }
    };

    const openEditFolders = (subUser: SubUser) => {
        setEditingUser(subUser);
        setSelectedFoldersForEdit(subUser.subuser_folders?.map(f => f.id) || []);
        setIsEditFoldersOpen(true);
    };

    const onSaveFolders = async () => {
        if (!user?.id || !editingUser) return;
        try {
            await userService.updateSubUserFolders(user.id, editingUser.id, selectedFoldersForEdit);
            toast.success("Folder access updated");
            setIsEditFoldersOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to update folders");
        }
    };

    const toggleFolderSelection = (folderId: string, currentSelection: string[], setSelection: (ids: string[]) => void) => {
        if (currentSelection.includes(folderId)) {
            setSelection(currentSelection.filter(id => id !== folderId));
        } else {
            setSelection([...currentSelection, folderId]);
        }
    };

    const isSuperAdmin = user?.roles?.some(r => r.name === "Super Admin" || r.super_admin) || false;
    const isSubUser = user?.is_sub || false;

    if (isSuperAdmin) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
                    Only regular subscribers can invite sub-users. Admins cannot.
                </div>
            </div>
        );
    }

    if (isSubUser) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4">
                    You are a sub-user. You cannot manage other users.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
                    <p className="text-muted-foreground">Manage sub-users and their access permissions.</p>
                </div>

                <Button onClick={() => setIsInviteOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                </Button>

                <Dialog open={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Invite New Team Member</DialogTitle>
                        <DialogDescription>
                            Send an invitation to join your team. They will have access to selected folders.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onInvite)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" {...register("name", { required: "Name is required" })} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="john@example.com" {...register("email", { required: "Email is required" })} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Folder Access</Label>
                            <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto space-y-2">
                                {folders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">No folders created yet.</p>
                                ) : (
                                    <Controller
                                        control={control}
                                        name="folder_ids"
                                        render={({ field }) => (
                                            <>
                                                {folders.map(folder => (
                                                    <div key={folder.id} className="flex items-center space-x-2">
                                                        <div
                                                            className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer ${field.value.includes(folder.id) ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                                                            onClick={() => toggleFolderSelection(folder.id, field.value, field.onChange)}
                                                        >
                                                            {field.value.includes(folder.id) && <Check className="h-3 w-3" />}
                                                        </div>
                                                        <span className="text-sm cursor-pointer select-none" onClick={() => toggleFolderSelection(folder.id, field.value, field.onChange)}>
                                                            {folder.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        You have {subUsers.length} active team members.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    ) : subUsers.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-lg font-medium">No team members yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Invite people to collaborate on your QR codes.</p>
                            <Button variant="outline" onClick={() => setIsInviteOpen(true)}>Invite Member</Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {subUsers.map((subUser) => (
                                <div key={subUser.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {subUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium leading-none">{subUser.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{subUser.email}</p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                <FolderOpen className="h-3 w-3" />
                                                <span>
                                                    {subUser.subuser_folders?.length
                                                        ? `${subUser.subuser_folders.length} Folders`
                                                        : "No access"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Actions</div>
                                            <DropdownMenuItem onClick={() => openEditFolders(subUser)}>
                                                <FolderOpen className="mr-2 h-4 w-4" />
                                                Manage Access
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => onDeleteUser(subUser.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Folders Dialog */}
            <Dialog open={isEditFoldersOpen} onClose={() => setIsEditFoldersOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Manage Access</DialogTitle>
                    <DialogDescription>
                        Select folders that <strong>{editingUser?.name}</strong> can access.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto space-y-2">
                        {folders.map(folder => (
                            <div key={folder.id} className="flex items-center space-x-2">
                                <div
                                    className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer ${selectedFoldersForEdit.includes(folder.id) ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                                    onClick={() => toggleFolderSelection(folder.id, selectedFoldersForEdit, setSelectedFoldersForEdit)}
                                >
                                    {selectedFoldersForEdit.includes(folder.id) && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-sm cursor-pointer select-none" onClick={() => toggleFolderSelection(folder.id, selectedFoldersForEdit, setSelectedFoldersForEdit)}>
                                    {folder.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditFoldersOpen(false)}>Cancel</Button>
                    <Button onClick={onSaveFolders}>Save Changes</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
