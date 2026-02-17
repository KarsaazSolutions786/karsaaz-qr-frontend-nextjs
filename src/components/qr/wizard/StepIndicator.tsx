"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";
import { Palette, QrCode, Sticker, Download, Type, FileText } from "lucide-react";

const STEPS = [
  { id: 0, label: "Type", icon: Type },
  { id: 1, label: "Content", icon: FileText },
  { id: 2, label: "Select color", icon: Palette },
  { id: 3, label: "Look & Feel", icon: QrCode },
  { id: 4, label: "Sticker", icon: Sticker },
  { id: 5, label: "Download", icon: Download },
];

export default function StepIndicator() {
  const { currentStep, setStep } = useQRWizard();

  return (
    <div className="w-full py-6 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setStep(index)}
                disabled={!isCompleted && !isActive} // Can navigate back, but not forward randomly
                className={cn(
                  "flex flex-col items-center gap-2 group focus:outline-none",
                  (isActive || isCompleted) ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-white dark:bg-gray-900",
                    isActive ? "border-primary text-primary scale-110 shadow-lg" : 
                    isCompleted ? "border-primary bg-primary text-white" : 
                    "border-gray-300 text-gray-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors hidden sm:block absolute top-14 w-24 text-center",
                  isActive ? "text-primary" : "text-gray-500"
                )}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
