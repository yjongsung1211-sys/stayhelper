import React from 'react';

interface LogoHFProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const LogoHF: React.FC<LogoHFProps> = ({
  className = '',
  size = 40,
  showWordmark = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Hexagon Emblem with HF monogram */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(184,134,11,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFB76C" />
              <stop offset="30%" stopColor="#B8860B" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6409" />
            </linearGradient>
          </defs>

          {/* Outer Hexagon */}
          <polygon
            points="50,4 96,29 96,86 50,111 4,86 4,29"
            stroke="url(#goldGrad)"
            strokeWidth="4"
            fill="none"
          />

          {/* Inner Hexagon */}
          <polygon
            points="50,12 90,34 90,81 50,103 10,81 10,34"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* Monogram H and F */}
          {/* Letter H */}
          <path
            d="M 28 36 L 28 79 M 28 57 L 50 57 M 50 36 L 50 79"
            stroke="url(#goldGrad)"
            strokeWidth="4.8"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Letter F */}
          <path
            d="M 50 36 L 73 36 M 50 54 L 68 54"
            stroke="url(#goldGrad)"
            strokeWidth="4.8"
            strokeLinecap="square"
          />

          {/* Center decorative accent dot */}
          <circle cx="50" cy="24" r="2.2" fill="url(#goldGrad)" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col tracking-tight">
          <span className="text-lg md:text-xl font-bold tracking-wider text-slate-900 font-sans group-hover:text-gold-700 transition-colors">
            화천퍼스트
          </span>
          <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] text-[#A48232] font-serif uppercase">
            HWACHEON FIRST
          </span>
        </div>
      )}
    </div>
  );
};
