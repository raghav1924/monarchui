import React from 'react';

interface RJLogoProps {
  className?: string;
}

/**
 * Monochrome R+J negative-space sculptural mark designed in Figma (RenderJet — Final Identity).
 */
export function RJLogo({ className = 'h-7 w-7' }: RJLogoProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22 20H74C96.0914 20 110 32.8 110 51.5C110 66.2 100.8 76.8 84.5 80.5L46 42V86L22 108V20ZM46 39V63L72 63C82 63 87 58.5 87 51C87 43.5 82 39 72 39H46Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
      <path
        d="M58 64L108 108H76C54 108 42 97 38 84L54 69C57.5 81 64.5 87 76 87H83L58 64Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const MonarchLogo = RJLogo;
