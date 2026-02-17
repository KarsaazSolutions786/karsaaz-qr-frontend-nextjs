"use client";

import { useQRWizard } from "@/store/use-qr-wizard";
import { cn } from "@/lib/utils";

/* Step icons matching Figma: color wheel, grid, sticker/scan, download arrow */
const STEPS = [
  { id: 2, label: "Select color", icon: "/images/wizard-icons/step-color.svg" },
  { id: 3, label: "Look & Feel", icon: "/images/wizard-icons/step-look.svg" },
  { id: 4, label: "Sticker", icon: "/images/wizard-icons/step-sticker.svg" },
  { id: 5, label: "Download", icon: "/images/wizard-icons/step-download.svg" },
];

export default function StepIndicator() {
  const { currentStep, setStep } = useQRWizard();

  /* Map wizard currentStep (2-5) to local step index (0-3) */
  const activeIdx = currentStep - 2;

  return (
    <div className="wizard-step-bar">
      {STEPS.map((step, idx) => {
        const isActive = idx <= activeIdx;
        const isCurrent = idx === activeIdx;
        const isCompleted = idx < activeIdx;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="wizard-step-item">
            {/* Circle */}
            <button
              onClick={() => isCompleted && setStep(step.id)}
              disabled={!isCompleted && !isCurrent}
              className={cn(
                "wizard-step-circle",
                isActive && "wizard-step-circle--active",
                isCurrent && "wizard-step-circle--current"
              )}
            >
              <StepIcon stepId={step.id} isActive={isActive} />
            </button>

            {/* Label */}
            <span
              className={cn(
                "wizard-step-label",
                isActive && "wizard-step-label--active"
              )}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "wizard-step-line",
                  idx < activeIdx && "wizard-step-line--active"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Inline SVG icons matching Figma step indicator */
function StepIcon({ stepId, isActive }: { stepId: number; isActive: boolean }) {
  const color = isActive ? "#AF47AF" : "#C4C4C4";

  switch (stepId) {
    case 2: // Color wheel
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill={color} />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" stroke={color} strokeWidth="2" />
          <circle cx="12" cy="5" r="2" fill="#FF6B6B" />
          <circle cx="17" cy="9" r="2" fill="#4ECDC4" />
          <circle cx="17" cy="15" r="2" fill="#45B7D1" />
          <circle cx="12" cy="19" r="2" fill="#96CEB4" />
          <circle cx="7" cy="15" r="2" fill="#DDA0DD" />
          <circle cx="7" cy="9" r="2" fill="#FFEAA7" />
        </svg>
      );
    case 3: // Grid / Look & Feel
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 4: // Sticker / QR scan
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <rect x="7" y="7" width="4" height="4" rx="1" fill={color} />
          <rect x="13" y="7" width="4" height="4" rx="1" fill={color} />
          <rect x="7" y="13" width="4" height="4" rx="1" fill={color} />
          <text x="12" y="20" textAnchor="middle" fontSize="5" fill={color} fontWeight="bold">SCAN</text>
        </svg>
      );
    case 5: // Download arrow
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v12M12 15l-4-4M12 15l4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
