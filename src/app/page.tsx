"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Brand/Logo";
import { Stepper } from "@/components/ui/Stepper";
import { StepShell } from "@/components/Steps/StepShell";
import { FlagSelect } from "@/components/Steps/FlagSelect";
import { VisaSelect } from "@/components/Steps/VisaSelect";
import type {
  Citizenship,
  Destination,
  OnboardingState,
  Visa,
} from "@/app/(landing)/state";
import { loadState, saveState, STORAGE_KEY } from "@/app/(landing)/state";

export default function Home() {
  const [state, setState] = useState<OnboardingState>(() => {
    // Lazy initialization - runs only once
    const saved = loadState();
    return saved;
  });
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = loadState();
    // Set current step based on completed selections
    if (saved.visa) return 3;
    if (saved.destination) return 2;
    if (saved.citizenship) return 2;
    return 1;
  });

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prevent scrolling to incomplete steps
  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY;

      // Check which section is in view
      const step1 = document.getElementById("step-1");
      const step2 = document.getElementById("step-2");
      const step3 = document.getElementById("step-3");

      if (!step1 || !step2 || !step3) return;

      const step1Top = step1.offsetTop;
      const step2Top = step2.offsetTop;
      const step3Top = step3.offsetTop;

      // Prevent access to step 2 if step 1 not completed
      if (!state.citizenship && scrollPosition >= step2Top - 150) {
        isScrolling = true;
        window.scrollTo({
          top: step1Top - 20,
          behavior: "smooth",
        });
        setCurrentStep(1);
        setTimeout(() => {
          isScrolling = false;
        }, 500);
        return;
      }

      // Prevent access to step 3 if step 1 or 2 not completed
      if (
        (!state.citizenship || !state.destination) &&
        scrollPosition >= step3Top - 150
      ) {
        isScrolling = true;
        const targetStep = !state.citizenship ? step1 : step2;
        window.scrollTo({
          top: targetStep.offsetTop - 20,
          behavior: "smooth",
        });
        setCurrentStep(!state.citizenship ? 1 : 2);
        setTimeout(() => {
          isScrolling = false;
        }, 500);
        return;
      }
    };

    // Use both scroll and wheel events for better coverage
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleWheel = (e: WheelEvent) => {
      const scrollPosition = window.scrollY;
      const step2 = document.getElementById("step-2");
      const step3 = document.getElementById("step-3");

      if (!step2 || !step3) return;

      const step2Top = step2.offsetTop;
      const step3Top = step3.offsetTop;

      // Prevent scrolling down to step 2 if step 1 not completed
      if (
        !state.citizenship &&
        e.deltaY > 0 &&
        scrollPosition + e.deltaY >= step2Top - 150
      ) {
        e.preventDefault();
        const step1 = document.getElementById("step-1");
        if (step1) {
          window.scrollTo({
            top: step1.offsetTop - 20,
            behavior: "smooth",
          });
        }
        return;
      }

      // Prevent scrolling down to step 3 if prerequisites not met
      if (
        (!state.citizenship || !state.destination) &&
        e.deltaY > 0 &&
        scrollPosition + e.deltaY >= step3Top - 150
      ) {
        e.preventDefault();
        const targetTop = !state.citizenship
          ? document.getElementById("step-1")?.offsetTop || 0
          : step2Top;
        window.scrollTo({
          top: targetTop - 150,
          behavior: "smooth",
        });
        return;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [state.citizenship, state.destination]);

  // Save state whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleCitizenshipChange = (value: string) => {
    const newState = { ...state, citizenship: value as Citizenship };
    setState(newState);

    // Smooth scroll to next step
    setTimeout(() => {
      document.getElementById("step-2")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentStep(2);
    }, 300);
  };

  const handleDestinationChange = (value: string) => {
    const newState = { ...state, destination: value as Destination };
    setState(newState);

    // Smooth scroll to next step
    setTimeout(() => {
      document.getElementById("step-3")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentStep(3);
    }, 300);
  };

  const handleVisaChange = (value: string) => {
    const newState = { ...state, visa: value as Visa };
    setState(newState);
  };

  const handleStepClick = (step: number) => {
    // Prevent navigating to steps if previous required steps aren't completed
    if (step === 2 && !state.citizenship) return;
    if (step === 3 && (!state.citizenship || !state.destination)) return;

    setCurrentStep(step);
    const stepId = `step-${step}`;
    document.getElementById(stepId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleReset = () => {
    setState({});
    setCurrentStep(1);
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    document.getElementById("step-1")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const citizenshipOptions: Citizenship[] = [
    "INDIA",
    "CANADA",
    "MEXICO",
    "SPAIN",
    "GERMANY",
  ];

  const destinationOptions: Destination[] = ["USA", "CANADA", "UK"];

  return (
    <div className="flex min-h-screen flex-col items-center bg-brand-navy font-sans">
      {/* Hero Section with Logo */}
      <div className="flex w-full flex-col items-center gap-8 px-8 py-16">
        <Logo size="xl" showIcon={false} />
        {(state.citizenship || state.destination || state.visa) && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border-4 border-brand-mint bg-brand-clay px-4 py-2 text-sm font-bold text-brand-navy shadow-[4px_4px_0_0_rgba(183,229,205,0.9)] transition-all hover:scale-105 hover:shadow-[6px_6px_0_0_rgba(183,229,205,0.9)] active:scale-95"
          >
            Reset All Selections
          </button>
        )}
      </div>

      {/* Stepper */}
      <Stepper
        currentStep={currentStep}
        totalSteps={3}
        completedSteps={
          [
            state.citizenship && 1,
            state.destination && 2,
            state.visa && 3,
          ].filter(Boolean) as number[]
        }
        onStepClick={handleStepClick}
      />

      {/* Step 1: Citizenship */}
      <StepShell
        id="step-1"
        stepNumber={1}
        title="Select your country of citizenship"
        isComplete={!!state.citizenship}
      >
        <FlagSelect
          value={state.citizenship}
          options={citizenshipOptions}
          onChange={handleCitizenshipChange}
        />
        {state.citizenship && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                // Clear citizenship and all subsequent selections
                const newState: OnboardingState = {};
                setState(newState);
                setCurrentStep(1);
              }}
              className="rounded-2xl border-4 border-brand-mint bg-brand-teal px-4 py-2 text-sm font-bold text-brand-navy shadow-[4px_4px_0_0_rgba(183,229,205,0.9)] transition-all hover:scale-105 hover:shadow-[6px_6px_0_0_rgba(183,229,205,0.9)] active:scale-95"
            >
              Change selection
            </button>
          </div>
        )}
      </StepShell>

      {/* Step 2: Destination */}
      <StepShell
        id="step-2"
        stepNumber={2}
        title="Select your destination country"
        isComplete={!!state.destination}
      >
        <FlagSelect
          value={state.destination}
          options={destinationOptions}
          onChange={handleDestinationChange}
        />
        {state.destination && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                // Clear destination and visa (subsequent selections)
                const newState = { ...state };
                delete newState.destination;
                delete newState.visa;
                setState(newState);
                setCurrentStep(2);
                document.getElementById("step-2")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="rounded-2xl border-4 border-brand-mint bg-brand-teal px-4 py-2 text-sm font-bold text-brand-navy shadow-[4px_4px_0_0_rgba(183,229,205,0.9)] transition-all hover:scale-105 hover:shadow-[6px_6px_0_0_rgba(183,229,205,0.9)] active:scale-95"
            >
              Change selection
            </button>
          </div>
        )}
      </StepShell>

      {/* Step 3: Visa Status */}
      <StepShell
        id="step-3"
        stepNumber={3}
        title="Select your visa type or status"
        isComplete={!!state.visa}
      >
        <VisaSelect value={state.visa} onChange={handleVisaChange} />
        {state.visa && (
          <div className="mt-8 rounded-2xl border-4 border-brand-mint bg-brand-clay p-6 text-center shadow-[6px_6px_0_0_rgba(183,229,205,0.9)]">
            <p className="text-lg font-bold text-brand-navy">
              🎉 All set! Your selections have been saved.
            </p>
            <p className="mt-2 text-sm text-brand-navy">
              Refresh the page to see your choices persist.
            </p>
          </div>
        )}
      </StepShell>
    </div>
  );
}
