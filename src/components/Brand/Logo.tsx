import Image from "next/image";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { text: "text-4xl", icon: 32 },
  md: { text: "text-5xl", icon: 40 },
  lg: { text: "text-6xl", icon: 56 },
  xl: { text: "text-7xl sm:text-8xl", icon: 64 },
};

export function Logo({ className, showIcon = true, size = "xl" }: LogoProps) {
  const { text: textSize, icon: iconSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      {showIcon && (
        <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
          <Image
            src="/icons/plane.svg"
            alt="Plane icon"
            width={iconSize}
            height={iconSize}
            className="h-full w-full fill-brand-mint text-brand-mint"
            priority
          />
        </div>
      )}
      <h1 className={`font-bold text-brand-mint ${textSize}`}>Immigame</h1>
    </div>
  );
}
