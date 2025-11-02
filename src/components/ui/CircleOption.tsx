"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CircleOptionProps {
  value: string;
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "circle" | "rectangle";
}

export function CircleOption({
  value,
  label,
  icon,
  selected = false,
  onClick,
  disabled = false,
  className,
  variant = "circle",
}: CircleOptionProps) {
  const isRectangle = variant === "rectangle";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-col items-center gap-3 transition-all",
        "focus:outline-none focus:ring-4 focus:ring-brand-mint focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-pressed={selected}
      aria-label={label}
    >
      {/* Button container - circle or rectangle */}
      <div
        className={cn(
          "flex items-center justify-center border-4 transition-all",
          isRectangle ? "h-28 w-36 rounded-2xl" : "h-20 w-20 rounded-full",
          "group-hover:scale-110 group-active:scale-95",
          selected
            ? "border-brand-mint bg-brand-clay shadow-[4px_4px_0_0_rgba(183,229,205,0.9)]"
            : "border-brand-mint bg-brand-teal shadow-[4px_4px_0_0_rgba(183,229,205,0.9)] group-hover:shadow-[6px_6px_0_0_rgba(183,229,205,0.9)]",
          disabled && "group-hover:scale-100"
        )}
      >
        {icon || (
          <span className="text-3xl text-brand-navy font-bold">{value[0]}</span>
        )}
      </div>
      {/* Label underneath */}
      <span
        className={cn(
          "text-sm font-semibold text-brand-mint transition-colors",
          selected && "underline decoration-2 underline-offset-4"
        )}
      >
        {label}
      </span>
    </button>
  );
}
