import React from 'react';

interface LogoProps {
  customLogoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const OFFICIAL_LOGO_URL = 'https://i.ibb.co/rGrNfBrk/ZA-Global-Tech-Institute-Logo.png';

export const Logo: React.FC<LogoProps> = ({
  customLogoUrl,
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-11 h-11', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];
  const logoSrc = customLogoUrl || OFFICIAL_LOGO_URL;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="ZA Global Tech Institute"
        className={`${icon} rounded-xl object-contain shrink-0`}
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-white font-['Space_Grotesk'] ${text}`}>
            ZA GLOBAL
          </span>
          <span className={`font-bold tracking-wider text-amber-400 font-['Space_Grotesk'] ${text}`}>
            TECH
          </span>
        </div>
        <span className={`font-semibold tracking-widest text-slate-400 uppercase font-sans mt-0.5 ${sub}`}>
          INSTITUTE
        </span>
        {showTagline && (
          <span className="text-[10px] text-amber-400/80 font-medium tracking-wide mt-1">
            LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.
          </span>
        )}
      </div>
    </div>
  );
};
