"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepShellProps {
  id: string;
  stepNumber: number;
  title: string;
  description?: string;
  children: ReactNode;
  onComplete?: () => void;
  isComplete?: boolean;
  className?: string;
}

export function StepShell({
  id,
  stepNumber,
  title,
  description,
  children,
  onComplete,
  isComplete = false,
  className,
}: StepShellProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Expose scroll method
  useEffect(() => {
    if (typeof window !== "undefined") {
      type WindowWithScrollToStep = Window &
        Record<string, (() => void) | undefined>;
      (window as WindowWithScrollToStep)[`scrollToStep${stepNumber}`] = () => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      };
    }
  }, [stepNumber]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-start gap-8 px-8 py-24",
        className
      )}
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold text-brand-mint sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-lg text-brand-mint sm:text-xl">
              {description}
            </p>
          )}
        </div>
        <div className="w-full">{children}</div>
        {isComplete && onComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-2xl border-4 border-brand-mint bg-brand-clay px-6 py-3 font-bold text-brand-navy shadow-[4px_4px_0_0_rgba(183,229,205,0.9)] transition-all hover:scale-105 hover:shadow-[6px_6px_0_0_rgba(183,229,205,0.9)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-mint focus:ring-offset-2"
          >
            Continue →
          </button>
        )}
      </div>
    </section>
  );
}
