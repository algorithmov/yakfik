"use client";

interface YakFikLogoProps {
  className?: string;
  size?: number;
}

export default function YakFikLogo({ className = "", size = 40 }: YakFikLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cat head shape */}
      <path
        d="M50 85C68.5 85 83.5 70 83.5 51.5C83.5 42.5 80 34.5 74.5 28.5L78 12C78 12 65 16 58 22C55.5 21 52.8 20.5 50 20.5C47.2 20.5 44.5 21 42 22C35 16 22 12 22 12L25.5 28.5C20 34.5 16.5 42.5 16.5 51.5C16.5 70 31.5 85 50 85Z"
        fill="#3D9970"
      />
      {/* Left ear inner */}
      <path
        d="M28 20L32 30L24 28L28 20Z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* Right ear inner */}
      <path
        d="M72 20L68 30L76 28L72 20Z"
        fill="white"
        fillOpacity="0.9"
      />
      {/* Left eye */}
      <ellipse cx="38" cy="50" rx="6" ry="7" fill="white" />
      <circle cx="39" cy="50" r="3" fill="#1a1a1a" />
      <circle cx="40" cy="48" r="1.2" fill="white" />
      {/* Right eye */}
      <ellipse cx="62" cy="50" rx="6" ry="7" fill="white" />
      <circle cx="61" cy="50" r="3" fill="#1a1a1a" />
      <circle cx="60" cy="48" r="1.2" fill="white" />
      {/* Nose */}
      <path
        d="M46 58C46 58 48 62 50 62C52 62 54 58 54 58C54 58 52 56 50 56C48 56 46 58 46 58Z"
        fill="white"
      />
      {/* Mouth */}
      <path
        d="M50 62C50 62 47 67 43 65"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 62C50 62 53 67 57 65"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Whiskers left */}
      <line x1="30" y1="55" x2="18" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="58" x2="16" y2="58" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers right */}
      <line x1="70" y1="55" x2="82" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="58" x2="84" y2="58" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}