"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";
import contentService from "@/services/content.service";
import { FileText } from "lucide-react";

export default function AdminBlogPostsPage() {
    return (
        <AdminCrudPage
            title="Blog Posts"
            description="Manage blog posts for the public website."
            icon={<FileText className="h-6 w-6 text-primary" />}
            columns={[
                { key: "id", label: "ID" },
                { key: "title", label: "Title" },
                { key: "slug", label: "Slug" },
                {
                    key: "status", label: "Status", render: (v: any) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {v || "draft"}
                        </span>
                    )
                },
                { key: "created_at", label: "Created" },
            ]}
            fetchFn={contentService.getBlogPosts}
            deleteFn={contentService.deleteBlogPost}
            createHref="/dashboard/blog-posts/new"
            editHref={(id) => `/dashboard/blog-posts/edit/${id}`}
        />
    );
}
