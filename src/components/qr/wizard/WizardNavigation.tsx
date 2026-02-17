"use client";

import { Button } from "@/components/ui/button";
import { useQRWizard } from "@/store/use-qr-wizard";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WizardNavigation() {
  const { currentStep, setStep, resetWizard } = useQRWizard();
  const router = useRouter();
  
  const totalSteps = 6; // 0 to 5

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleFinish = () => {
    // Save draft or finalized logic here
    console.log("Wizard Finished");
    resetWizard(); // Clean state
    router.push("/dashboard/qrcodes");
  };

  const handleSkip = () => {
    // Skip to finish or dashboard
    console.log("Wizard Skipped");
    router.push("/dashboard/qrcodes");
  };

  return (
    <div className="flex items-center justify-between p-4 border-t bg-white dark:bg-gray-900 mt-auto sticky bottom-0 z-10">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex gap-2">
        {currentStep === totalSteps - 1 ? (
          <>
            <Button variant="ghost" onClick={handleSkip} className="gap-2 text-muted-foreground">
              Skip
            </Button>
            <Button onClick={handleFinish} className="gap-2 bg-green-600 hover:bg-green-700">
              Finish
              <Check className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
