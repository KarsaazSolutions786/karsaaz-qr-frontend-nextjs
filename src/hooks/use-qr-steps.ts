"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export type QRStep = "content" | "design" | "download";

const STEPS: QRStep[] = ["content", "design", "download"];

export function useQRSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentStep = useMemo(() => {
    const step = searchParams.get("step") as QRStep;
    return STEPS.includes(step) ? step : "content";
  }, [searchParams]);

  const setStep = useCallback((step: QRStep) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const nextStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  }, [currentStep, setStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    } else {
      router.back();
    }
  }, [currentStep, setStep, router]);

  return {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === "content",
    isLastStep: currentStep === "download",
    steps: STEPS,
  };
}
