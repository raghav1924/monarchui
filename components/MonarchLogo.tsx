import React from 'react';

interface RJLogoProps {
  className?: string;
}

/**
 * Geometric interlocked R·J monogram designed in Figma (node 2:2).
 */
export function RJLogo({ className = 'h-6 w-6' }: RJLogoProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 24H55C72 24 82 33 82 48C82 63 72 72 55 72H38V104H24V24ZM38 38V58H55C63 58 68 55 68 48C68 41 63 38 55 38H38Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
      <path d="M49 65H65L88 104H72L49 65Z" fill="currentColor" />
      <path
        d="M90 24H104V77C104 94 94 104 77 104H63V90H76C85 90 90 85 90 76V24Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const MonarchLogo = RJLogo;
