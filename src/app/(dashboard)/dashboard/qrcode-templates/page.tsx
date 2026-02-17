"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/use-api";
import { qrCodeService } from "@/services/qr.service";
import { Copy, LayoutTemplate, Loader2, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function QRCodeTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { call, isLoading } = useApi();
  const router = useRouter();

  const fetchTemplates = useCallback(async () => {
    try {
      const data = await qrCodeService.getAll({ is_template: true } as any);
      setTemplates(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to fetch templates", error);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await call(() => qrCodeService.delete(id));
      toast.success("Template deleted");
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleUseTemplate = (id: string | number) => {
    router.push(`/dashboard/qrcodes/new?template_id=${id}`);
  };

  const filteredTemplates = templates.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const publicTemplates = filteredTemplates.filter(t => t.template_access_level === 'public');
  const myTemplates = filteredTemplates.filter(t => t.template_access_level !== 'public');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">QR Templates</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Ready-to-use designs for your next campaign
            </p>
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-10 rounded-xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="public" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="public" className="uppercase font-black text-[10px] tracking-widest">Public Gallery</TabsTrigger>
          <TabsTrigger value="my" className="uppercase font-black text-[10px] tracking-widest">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="public">
          <TemplateGrid 
            items={publicTemplates} 
            onUse={handleUseTemplate} 
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="my">
          <TemplateGrid 
            items={myTemplates} 
            onUse={handleUseTemplate} 
            onDelete={handleDelete}
            isLoading={isLoading}
            isOwner
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateGrid({ items, onUse, onDelete, isLoading, isOwner }: any) {
  if (isLoading && items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="rounded-[2rem] border-2 border-dashed bg-muted/20 py-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No templates found</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t: any) => (
        <Card key={t.id} className="rounded-[2rem] border-2 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden">
            {t.simple_png_url ? (
              <img src={t.simple_png_url} alt={t.name} className="w-2/3 h-2/3 object-contain transition-transform group-hover:scale-110" />
            ) : (
              <LayoutTemplate className="h-12 w-12 text-muted-foreground/20" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" className="rounded-xl font-black uppercase text-[9px] tracking-widest" onClick={() => onUse(t.id)}>
                Use Template
              </Button>
            </div>
          </div>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm truncate max-w-[150px]">{t.name}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t.type}</p>
            </div>
            {isOwner && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 rounded-lg" onClick={() => onDelete(t.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
