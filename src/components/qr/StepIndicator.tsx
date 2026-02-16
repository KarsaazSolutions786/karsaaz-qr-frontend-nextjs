"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";
import { QRStep } from "@/hooks/use-qr-steps";

interface StepIndicatorProps {
  currentStep: QRStep;
  steps: QRStep[];
}

const STEP_LABELS: Record<QRStep, string> = {
  content: "Content",
  design: "Design",
  download: "Finish"
};

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-12">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative group">
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
                  isCompleted ? "bg-blue-600 border-blue-600 text-white shadow-blue-200" : 
                  isActive ? "bg-white border-blue-600 text-blue-600 shadow-blue-100 scale-110" : 
                  "bg-white border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span className="text-sm font-black">{index + 1}</span>}
              </div>
              <span className={cn(
                "absolute -bottom-7 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-300",
                isActive ? "text-blue-600" : "text-muted-foreground"
              )}>
                {STEP_LABELS[step]}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-muted relative overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-0 bg-blue-600 transition-all duration-700 ease-in-out origin-left",
                    isCompleted ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
