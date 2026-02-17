"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import StepIndicator from "@/components/qr/wizard/StepIndicator";
import WizardNavigation from "@/components/qr/wizard/WizardNavigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getQRTypeById } from "@/data/qr-types";

// Steps
import TypeSelection from "@/components/qr/wizard/steps/TypeSelection";
import DataInput from "@/components/qr/wizard/steps/DataInput";
import ColorSelection from "@/components/qr/wizard/steps/ColorSelection";
import LookAndFeel from "@/components/qr/wizard/steps/LookAndFeel";
import StickerSelection from "@/components/qr/wizard/steps/StickerSelection";
import DownloadPreview from "@/components/qr/wizard/steps/DownloadPreview";

const StepComponents = [
  TypeSelection,
  DataInput,
  ColorSelection,
  LookAndFeel,
  StickerSelection,
  DownloadPreview,
];

export default function NewQRCodePage() {
  const { currentStep, qrType, setStep } = useQRWizard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const CurrentStepComponent = StepComponents[currentStep] || StepComponents[0];
  const isTypeStep = currentStep === 0;
  const isDataStep = currentStep === 1;
  const showWizardChrome = currentStep >= 2;

  const typeInfo = qrType ? getQRTypeById(qrType) : null;
  const typeName = typeInfo?.name || qrType?.toUpperCase() || "URL/LINK";

  /* ── Step 0: Type selection — clean full-page layout ── */
  if (isTypeStep) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <CurrentStepComponent />
      </div>
    );
  }

  /* ── Step 1: Data input — own layout (has back/next built-in) ── */
  if (isDataStep) {
    return (
      <div className="wizard-page">
        <CurrentStepComponent />
      </div>
    );
  }

  /* ── Steps 2-5: Wizard with step indicator, content, and navigation ── */
  return (
    <div className="wizard-page">
      {/* Title bar: back arrow + type name */}
      <div className="wizard-title-bar">
        <button onClick={() => setStep(currentStep - 1)} className="wizard-data-back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="wizard-data-title">{typeName}</h1>
      </div>

      {/* Step indicator (Select color → Look & Feel → Sticker → Download) */}
      {showWizardChrome && <StepIndicator />}

      {/* Main content card */}
      <div className="wizard-content-card">
        <CurrentStepComponent />
      </div>

      {/* Bottom navigation */}
      {showWizardChrome && <WizardNavigation />}
    </div>
  );
}
