"use client";

import Image from "next/image";
import { CircleOption } from "@/components/ui/CircleOption";

const VISA_OPTIONS: Record<string, { icon: string; label: string }> = {
  H1B: { icon: "/icons/worker.svg", label: "H1B" },
  F1: { icon: "/icons/student.svg", label: "F1" },
  B1B2: { icon: "/icons/briefcase.svg", label: "B1/B2" },
  NONE: { icon: "/icons/question.svg", label: "None/Other" },
};

interface VisaSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function VisaSelect({ value, onChange }: VisaSelectProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {Object.entries(VISA_OPTIONS).map(([visaType, { icon, label }]) => (
        <CircleOption
          key={visaType}
          value={visaType}
          label={label}
          icon={
            <div className="flex h-10 w-10 items-center justify-center">
              <Image
                src={icon}
                alt={label}
                width={40}
                height={40}
                className="h-full w-full"
              />
            </div>
          }
          selected={value === visaType}
          onClick={() => onChange(visaType)}
        />
      ))}
    </div>
  );
}
