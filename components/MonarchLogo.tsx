import React from 'react';

interface RJLogoProps {
  className?: string;
}

/**
 * Luxury obsidian & champagne-gold RenderJet (RJ) architectural monogram designed in Figma (node 3:2).
 */
export function RJLogo({ className = 'h-8 w-8' }: RJLogoProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="0.75" y="0.75" width="126.5" height="126.5" rx="29.25" fill="url(#rj_bg)" />
      <rect
        x="0.75"
        y="0.75"
        width="126.5"
        height="126.5"
        rx="29.25"
        stroke="url(#rj_border)"
        strokeWidth="1.5"
      />
      <path
        d="M30 94V34H58C71.5 34 80 41.5 80 53C80 63.5 72.5 70.5 60.5 71.5L80 94"
        strokeWidth="10.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#FAFAFA"
      />
      <path
        d="M96 34V77C96 89.5 88.5 96 76 96C70.5 96 66 94.2 63 91"
        strokeWidth="10.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#E5C158"
      />
      <circle cx="96" cy="34" r="5.25" fill="#E5C158" />
      <defs>
        <linearGradient id="rj_bg" x1="1.34" y1="-2.19" x2="110.92" y2="64.84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1C1C21" />
          <stop offset="1" stopColor="#08080A" />
        </linearGradient>
        <linearGradient id="rj_border" x1="0" y1="64" x2="128" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#E5C158" stopOpacity="0.45" />
          <stop offset="1" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const MonarchLogo = RJLogo;
