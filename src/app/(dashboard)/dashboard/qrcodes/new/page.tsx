"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { allQRTypes } from "@/data/qr-types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateQRCodePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Dynamic" | "Static">("All");

  const filteredTypes = allQRTypes.filter((type) => {
    const matchesSearch = type.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (id: string) => {
    // Navigate to next step (designer/details)
    router.push(`/dashboard/qrcodes/new/${id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">What type of QR Code do you want?</h1>
        <p className="text-muted-foreground">Select one of the options below to get started.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search types..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
          {["All", "Dynamic", "Static"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                selectedCategory === cat 
                  ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400" 
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTypes.map((type) => (
          <Card 
            key={type.id} 
            className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
            onClick={() => handleSelect(type.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 dark:bg-blue-900/20">
                <type.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{type.name}</h3>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full dark:bg-gray-800">
                  {type.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
