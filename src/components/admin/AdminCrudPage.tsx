"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Edit, Loader2, Plus, Search, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface AdminCrudPageProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    columns: Column[];
    fetchFn: (params?: any) => Promise<any>;
    deleteFn?: (id: string | number) => Promise<any>;
    createHref?: string;
    editHref?: (id: string | number) => string;
    idField?: string;
    searchable?: boolean;
    paginated?: boolean;
}

export default function AdminCrudPage({
    title,
    description,
    icon,
    columns,
    fetchFn,
    deleteFn,
    createHref,
    editHref,
    idField = "id",
    searchable = true,
    paginated = true,
}: AdminCrudPageProps) {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (paginated) params.page = page;
            if (searchable && search) params.search = search;
            const response = await fetchFn(params);
            // Handle both paginated and non-paginated responses
            if (response?.data && Array.isArray(response.data)) {
                setItems(response.data);
                setTotalPages(response.last_page || response.meta?.last_page || 1);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                setItems(response.data.data);
                setTotalPages(response.data.last_page || 1);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error(`Failed to fetch ${title}`, error);
            toast.error(`Failed to load ${title.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, page, search, paginated, searchable, title]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleDelete = async (id: string | number) => {
        if (!deleteFn || !confirm(`Are you sure you want to delete this item?`)) return;
        try {
            await deleteFn(id);
            toast.success("Item deleted successfully");
            fetchItems();
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {description && <p className="text-muted-foreground">{description}</p>}
                    </div>
                </div>
                {createHref && (
                    <a href={createHref}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Button>
                    </a>
                )}
            </div>

            {searchable && (
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="pl-8"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
            )}

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No {title.toLowerCase()} found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                                        {columns.map((col) => (
                                            <th key={col.key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                                                {col.label}
                                            </th>
                                        ))}
                                        {(editHref || deleteFn) && (
                                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => (
                                        <tr key={item[idField] || idx} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                            {columns.map((col) => (
                                                <td key={col.key} className="px-4 py-3">
                                                    {col.render ? col.render(item[col.key], item) : (item[col.key] ?? "—")}
                                                </td>
                                            ))}
                                            {(editHref || deleteFn) && (
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {editHref && (
                                                            <a href={editHref(item[idField])}>
                                                                <Button variant="ghost" size="icon">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                        )}
                                                        {deleteFn && (
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"
                                                                onClick={() => handleDelete(item[idField])}>
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {paginated && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
