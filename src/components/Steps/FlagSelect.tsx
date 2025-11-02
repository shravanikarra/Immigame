"use client";

import { CircleOption } from "@/components/ui/CircleOption";

const FLAGS: Record<string, { emoji: string; label: string }> = {
  INDIA: { emoji: "🇮🇳", label: "India" },
  CANADA: { emoji: "🇨🇦", label: "Canada" },
  MEXICO: { emoji: "🇲🇽", label: "Mexico" },
  SPAIN: { emoji: "🇪🇸", label: "Spain" },
  GERMANY: { emoji: "🇩🇪", label: "Germany" },
  USA: { emoji: "🇺🇸", label: "USA" },
  UK: { emoji: "🇬🇧", label: "UK" },
};

interface FlagSelectProps {
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}

export function FlagSelect({ value, options, onChange }: FlagSelectProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {options.map((option) => {
        const flag = FLAGS[option];
        if (!flag) return null;

        return (
          <CircleOption
            key={option}
            value={option}
            label={flag.label}
            icon={<span className="text-8xl leading-none">{flag.emoji}</span>}
            selected={value === option}
            onClick={() => onChange(option)}
            variant="rectangle"
          />
        );
      })}
    </div>
  );
}
