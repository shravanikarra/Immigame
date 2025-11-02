"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  currentStep,
  totalSteps,
  completedSteps = [],
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        "sticky top-4 z-50 flex items-center justify-center gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2 rounded-2xl border-4 border-brand-mint bg-brand-teal px-4 py-2 shadow-[4px_4px_0_0_rgba(183,229,205,0.9)]">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = completedSteps.includes(step);

          return (
            <button
              key={step}
              type="button"
              onClick={() => onStepClick?.(step)}
              disabled={
                !isCompleted &&
                !isActive &&
                step > 1 &&
                !completedSteps.includes(step - 1)
              }
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-sm transition-all",
                "focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2",
                isActive
                  ? "border-brand-mint bg-brand-clay text-brand-navy shadow-[2px_2px_0_0_rgba(183,229,205,0.9)]"
                  : isCompleted
                    ? "border-brand-mint bg-brand-teal text-brand-navy"
                    : "border-brand-mint bg-brand-teal text-brand-mint",
                !isCompleted &&
                  !isActive &&
                  step > 1 &&
                  !completedSteps.includes(step - 1)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110 active:scale-95"
              )}
              aria-label={`Step ${step}`}
              aria-current={isActive ? "step" : undefined}
              aria-disabled={
                !isCompleted &&
                !isActive &&
                step > 1 &&
                !completedSteps.includes(step - 1)
              }
            >
              {isCompleted ? <span className="text-lg">✓</span> : step}
            </button>
          );
        })}
      </div>
    </div>
  );
}
