import React from 'react';

interface CoffeeLoaderProps {
  fullScreen?: boolean;
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoffeeLoader: React.FC<CoffeeLoaderProps> = ({
  fullScreen = false,
  message = 'Brewing fresh Coorg harvest...',
  submessage = 'Shade-grown at 4,000 ft in Western Ghats',
  size = 'md',
}) => {
  const isLarge = size === 'lg' || fullScreen;
  const isSmall = size === 'sm';

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md px-4 transition-colors'
    : 'flex flex-col items-center justify-center p-6 text-center';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="relative flex flex-col items-center justify-center">
        {/* Steam Wisps Rising from the Coffee Cup */}
        <div className="relative h-10 w-16 mb-1 flex items-end justify-center space-x-2">
          {/* Steam Wisp 1 */}
          <div className="w-1.5 h-6 rounded-full bg-gradient-to-t from-[#C89B3C]/60 via-[#E8D9C5]/40 to-transparent animate-steam-1 blur-[0.5px]" />
          {/* Steam Wisp 2 (Center, taller) */}
          <div className="w-2 h-8 rounded-full bg-gradient-to-t from-[#C89B3C]/70 via-[#E8D9C5]/50 to-transparent animate-steam-2 blur-[0.5px]" />
          {/* Steam Wisp 3 */}
          <div className="w-1.5 h-7 rounded-full bg-gradient-to-t from-[#C89B3C]/60 via-[#E8D9C5]/40 to-transparent animate-steam-3 blur-[0.5px]" />
        </div>

        {/* Coffee Cup / Davarah Tumbler SVG */}
        <div
          className={`relative ${
            isLarge ? 'w-24 h-24' : isSmall ? 'w-12 h-12' : 'w-18 h-18'
          } flex items-center justify-center`}
        >
          <svg
            viewBox="0 0 100 90"
            className="w-full h-full drop-shadow-[0_8px_20px_rgba(200,155,60,0.25)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cup Handle */}
            <path
              d="M72 32 C86 32, 88 56, 70 60"
              stroke="#C89B3C"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cup Outer Body (Rich brass gold rim and dark ceramic) */}
            <path
              d="M20 25 L26 68 C27 75, 73 75, 74 68 L80 25 Z"
              fill="url(#cupGradient)"
              stroke="#C89B3C"
              strokeWidth="3.5"
            />

            {/* Coffee Liquid Reservoir (fills up) */}
            <g clipPath="url(#cupClip)">
              {/* Coffee Decoction Liquid */}
              <rect
                x="20"
                y="32"
                width="60"
                height="45"
                fill="url(#coffeeLiquid)"
                className="animate-pulse"
              />
              {/* Golden Froth Crema Layer on Top */}
              <ellipse
                cx="50"
                cy="35"
                rx="24"
                ry="4"
                fill="#C89B3C"
                opacity="0.9"
              />
            </g>

            {/* Cup Saucer Base */}
            <ellipse
              cx="50"
              cy="80"
              rx="40"
              ry="5"
              fill="#1A120B"
              stroke="#C89B3C"
              strokeWidth="2.5"
            />

            {/* Subtle Cup Sheen Reflection */}
            <path
              d="M28 30 L32 64"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <defs>
              <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A1B12" />
                <stop offset="50%" stopColor="#1E130D" />
                <stop offset="100%" stopColor="#140C08" />
              </linearGradient>

              <linearGradient id="coffeeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C89B3C" />
                <stop offset="30%" stopColor="#6E3E1F" />
                <stop offset="100%" stopColor="#28150B" />
              </linearGradient>

              <clipPath id="cupClip">
                <path d="M22 28 L27 67 C28 73, 72 73, 73 67 L78 28 Z" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Bouncing Triple Coffee Beans */}
        <div className="flex items-center space-x-2 mt-4">
          <span
            className="w-2.5 h-3.5 rounded-full bg-[#C89B3C] border border-[#2A1B12] shadow-sm animate-bean-1 inline-block"
            title="Bean 1"
          />
          <span
            className="w-3 h-4 rounded-full bg-[#583321] border border-[#C89B3C]/50 shadow-sm animate-bean-2 inline-block"
            title="Bean 2"
          />
          <span
            className="w-2.5 h-3.5 rounded-full bg-[#C89B3C] border border-[#2A1B12] shadow-sm animate-bean-3 inline-block"
            title="Bean 3"
          />
        </div>

        {/* Message and Submessage */}
        {message && (
          <div className="mt-4 space-y-1 text-center max-w-xs">
            <p className="font-display tracking-widest text-sm uppercase text-foreground">
              {message}
            </p>
            {submessage && (
              <p className="text-[11px] text-muted-foreground font-medium">
                {submessage}
              </p>
            )}
          </div>
        )}

        {/* Mini Gold Progress Bar */}
        <div className="w-36 h-1 rounded-full bg-border overflow-hidden mt-3">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#C89B3C] to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
