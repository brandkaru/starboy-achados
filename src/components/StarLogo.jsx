import React from 'react';

// Official Tilted Y2K 5-Point Star Component
export default function StarLogo({ size = 32, color = '#ffffff', style }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <defs>
        <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Tilted 5-Point Y2K Star Path matching the user's uploaded image */}
      <path 
        d="M 68 8 L 52 38 L 92 48 L 56 68 L 72 100 L 42 74 L 14 96 L 28 60 L 2 36 L 38 36 Z" 
        fill={color}
        filter="url(#starGlow)"
      />
    </svg>
  );
}
