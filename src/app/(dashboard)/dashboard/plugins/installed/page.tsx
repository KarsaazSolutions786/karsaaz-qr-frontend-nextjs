"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Ticket } from "lucide-react";
import Link from "next/link";

export default function InstalledPluginsPage() {
  // Mock installed plugins
  const installedPlugins = [
    {
      slug: "affiliates",
      name: "Affiliates & Coupons",
      description: "Manage affiliate programs and discount coupons.",
      icon: Ticket,
      enabled: true,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Installed Plugins</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {installedPlugins.map((plugin) => (
          <Card key={plugin.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <plugin.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{plugin.name}</CardTitle>
              </div>
              <CardDescription>{plugin.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Active
              </span>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/plugins/plugin/${plugin.slug}`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
