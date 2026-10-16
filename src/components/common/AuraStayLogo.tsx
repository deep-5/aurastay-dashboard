import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AuraStayLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Original Bespoke Luxury Monogram Logo */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#1E60E8] via-[#2583E9] to-[#0E4AB3] flex items-center justify-center text-white shadow-md shadow-[#2583E9]/25 flex-shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Stylized Modern Luxury 'A' & Hotel Crown Canopy */}
          <path
            d="M16 4L6 24H11L13.5 19H18.5L21 24H26L16 4Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          <path
            d="M16 9L14.2 15H17.8L16 9Z"
            fill="#D2F829"
          />
          <circle cx="16" cy="27" r="2" fill="#D2F829" />
        </svg>

        {/* Subtle Luxury Sheen Accent */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-full pointer-events-none" />
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`${textSizes[size]} font-black tracking-tight text-[#0F172A] leading-tight`}
            >
              Aura<span className="text-[#2583E9]">Stay</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded bg-[#D2F829] text-[#0F172A]">
              PRO
            </span>
          </div>
          <span className="text-[9px] font-semibold text-[#64748B] tracking-wide -mt-0.5">
            Hospitality Cloud OS
          </span>
        </div>
      )}
    </div>
  );
};
