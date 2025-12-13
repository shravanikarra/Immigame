import React from 'react';

interface BrandLogoProps {
  size?: number;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 52 }) => {
  return (
    <div
      className="relative rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-600 shadow-[0_12px_30px_-12px_rgba(37,99,235,0.65)] overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-[3px] rounded-2xl bg-slate-950/70 backdrop-blur-sm border border-white/10" />
      <div className="relative flex items-center justify-center h-full w-full">
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="19" stroke="white" strokeWidth="2.4" opacity="0.92" />
          <path
            d="M13.5 32h37M32 13c6 5.5 6 32.5 0 38-6-5.5-6-32.5 0-38Z"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M26 22c1.9-3 4.5-5 9.7-5 7.8 0 14.3 6.5 14.3 14.3 0 5.3-2.3 9.4-6.2 12.1"
            stroke="url(#brandGradient)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M34 19.5l11-5-5 11"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="brandGradient" x1="20" y1="16" x2="49" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5f3fc" />
              <stop offset="1" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default BrandLogo;
