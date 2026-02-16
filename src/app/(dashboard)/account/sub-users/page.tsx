"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import userService, { User } from "@/services/user.service"; // Import User interface
import { Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SubUsersPage() {
  const { user } = useAuth();
  const [subUsers, setSubUsers] = useState<User[]>([]); // Use User interface
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchSubUsers = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await userService.getSubUsers(user.id);
      setSubUsers(response.data || []);
    } catch (error: unknown) { // Use unknown for error
      console.error("Failed to fetch sub-users", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Add user?.id to dependencies

  useEffect(() => {
    fetchSubUsers();
  }, [fetchSubUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    if (!user?.id) return;

    setInviting(true);
    try {
      await userService.inviteSubUser(user.id, { email: inviteEmail });
      toast.success("Invitation sent successfully");
      setInviteEmail("");
      fetchSubUsers();
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError?.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (subUserId: string | number) => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to remove this sub-user?")) return;

    try {
      await userService.deleteSubUser(user.id, subUserId);
      toast.success("Sub-user removed");
      fetchSubUsers();
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError?.message || "Failed to remove sub-user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sub-Users</h3>
        <p className="text-sm text-gray-500">
          Invite team members to manage your QR codes.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Invite Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invite New User</CardTitle>
            <CardDescription>
              Enter an email address to invite a new sub-user to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  className="pl-9"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={inviting}
                />
              </div>
              <Button type="submit" disabled={inviting}>
                {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Invite
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : subUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subUsers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{sub.name || "Pending Invite"}</span>
                          <span className="text-xs text-gray-500">{sub.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sub.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {sub.email_verified_at ? 'Active' : 'Pending Verification'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(sub.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-lg border-dashed">
                No sub-users found. Invite someone to get started!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
