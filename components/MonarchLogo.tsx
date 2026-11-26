import React from 'react';

interface MonarchLogoProps {
  className?: string;
}

/**
 * Geometric M-Crown monogram designed in Figma (node 1:2).
 */
export function MonarchLogo({ className = 'h-6 w-6' }: MonarchLogoProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 30L44 50L64 20L84 50L110 30L100 104H80L84 66L64 86L44 66L48 104H28L18 30Z"
        fill="currentColor"
      />
    </svg>
  );
}
