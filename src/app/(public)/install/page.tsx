"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Server, Terminal } from "lucide-react";
import Link from "next/link";

export default function InstallIntroduction() {
  const prerequisites = [
    "PHP 8.2+ with necessary extensions",
    "MySQL 8.0+ or MariaDB 10.4+",
    "Valid Envato Purchase Code",
    "Configured Domain or Localhost",
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Welcome to the Installation</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Thank you for choosing Karsaaz QR. This wizard will guide you through the initial setup process, 
          ensuring your database, mail, and administrative settings are correctly configured for your new QR platform.
        </p>
      </div>

      <div className="bg-muted/30 rounded-[2rem] p-8 border-2 border-dashed space-y-6">
        <div className="flex items-center gap-3">
          <Server className="h-5 w-5 text-blue-600" />
          <h3 className="font-black uppercase tracking-widest text-xs">Prerequisites Check</h3>
        </div>
        
        <div className="grid gap-3">
          {prerequisites.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild size="lg" className="rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase font-black text-[10px] tracking-widest">
          <Link href="/install/purchase-code">
            Start Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
