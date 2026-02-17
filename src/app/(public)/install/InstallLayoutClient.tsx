"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, Database, Mail, ShieldCheck, ShoppingBag, Terminal } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const steps = [
  { path: "/install", label: "Intro", icon: Terminal },
  { path: "/install/purchase-code", label: "License", icon: ShoppingBag },
  { path: "/install/app-details", label: "App", icon: CheckCircle2 },
  { path: "/install/database", label: "Database", icon: Database },
  { path: "/install/super-user", label: "Admin", icon: ShieldCheck },
  { path: "/install/mail", label: "Mail", icon: Mail },
];

export default function InstallLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    const index = steps.findIndex(s => s.path === pathname);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <Terminal className="h-3 w-3" /> System Installation
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Karsaaz QR Wizard</h1>
          <p className="text-muted-foreground uppercase font-bold text-[10px] tracking-widest">Follow the steps below to initialize your system</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between px-4 overflow-x-auto pb-4 sm:pb-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={step.path} className="flex items-center group">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all",
                    isActive ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200" :
                    isCompleted ? "bg-green-50 border-green-200 text-green-600" :
                    "bg-background border-muted text-muted-foreground"
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-tighter",
                    isActive ? "text-blue-600" : "text-muted-foreground"
                  )}>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-4 mb-6">
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form Area */}
        <Card className="rounded-[3rem] border-2 shadow-2xl shadow-blue-100 overflow-hidden bg-background">
          <CardContent className="p-8 sm:p-12">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Karsaaz EBS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
