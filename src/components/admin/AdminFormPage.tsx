"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AdminFormPageProps {
  title: string;
  description?: string;
  backHref: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isEdit?: boolean;
  onSave: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

export default function AdminFormPage({
  title,
  description,
  backHref,
  isLoading,
  isSubmitting,
  isEdit,
  onSave,
  onDelete,
  children,
}: AdminFormPageProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href={backHref}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
          <Button onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
