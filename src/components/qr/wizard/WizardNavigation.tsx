"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WizardNavigation() {
  const { currentStep, setStep, resetWizard } = useQRWizard();
  const router = useRouter();

  const totalSteps = 6; // 0-5
  const isFinalStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    resetWizard();
    router.push("/dashboard/qrcodes");
  };

  const handleClose = () => {
    resetWizard();
    router.push("/dashboard/qrcodes");
  };

  return (
    <div className="wizard-nav-bar">
      <div className="wizard-nav-inner">
        {/* Left: Finish link (steps 2-4) or empty */}
        <div>
          {!isFinalStep && currentStep >= 2 && (
            <button onClick={handleFinish} className="wizard-nav-finish">
              Finish
            </button>
          )}
        </div>

        {/* Right: Back + Next / Close */}
        <div className="wizard-nav-actions">
          {currentStep > 1 && (
            <button onClick={handleBack} className="wizard-nav-back">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {isFinalStep ? (
            <button onClick={handleClose} className="wizard-nav-next">
              <span>Close</span>
            </button>
          ) : (
            <button onClick={handleNext} className="wizard-nav-next">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
