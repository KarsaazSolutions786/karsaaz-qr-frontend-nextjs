"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import StepIndicator from "@/components/qr/wizard/StepIndicator";
import WizardNavigation from "@/components/qr/wizard/WizardNavigation";
import { useEffect, useState } from "react";

// Steps
import TypeSelection from "@/components/qr/wizard/steps/TypeSelection";
import DataInput from "@/components/qr/wizard/steps/DataInput";
import ColorSelection from "@/components/qr/wizard/steps/ColorSelection";
import LookAndFeel from "@/components/qr/wizard/steps/LookAndFeel";
import StickerSelection from "@/components/qr/wizard/steps/StickerSelection";
import DownloadPreview from "@/components/qr/wizard/steps/DownloadPreview";

// Preview
import QRPreview from "@/components/qr/QRPreview"; 

const StepComponents = [
  TypeSelection,
  DataInput,
  ColorSelection,
  LookAndFeel,
  StickerSelection,
  DownloadPreview,
];

export default function NewQRCodePage() {
  const { currentStep } = useQRWizard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const CurrentStepComponent = StepComponents[currentStep] || StepComponents[0];
  const isFinalStep = currentStep === StepComponents.length - 1;

  const isTypeStep = currentStep === 0;

  /* ── Step 0: Type selection — clean full-page layout (matches Figma) ── */
  if (isTypeStep) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <CurrentStepComponent />
      </div>
    );
  }

  /* ── Steps 1+: Wizard layout with indicator, preview, and navigation ── */
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-black">
      <StepIndicator />

      <main className="flex-1 container mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* Left: Configuration Steps */}
          <div className={`lg:col-span-${isFinalStep ? '12' : '8'} flex flex-col`}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 min-h-[500px] h-full">
              <CurrentStepComponent />
            </div>
          </div>

          {/* Right: Live Preview (Hidden on final step as it has its own) */}
          {!isFinalStep && (
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-8 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-center">
                  <div className="scale-75 origin-top">
                    {/* Integrated existing QRPreview component */}
                    <QRPreview />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Live Preview
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <WizardNavigation />
    </div>
  );
}
