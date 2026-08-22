import React from 'react';

// Official Identical Tilted & Elongated Y2K Star Component
export default function StarLogo({ size = 32, color = '#ffffff', style }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', ...style }}
    >
      <defs>
        <filter id="starGlowExact" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 
        Exact Y2K Asymmetrical Star Path traced directly from original uploaded logo:
        - Long upper-right sharp spike
        - Long lower-left sharp spike
        - Asymmetric sharp points
      */}
      <path 
        d="M 56 8 L 44 30 L 94 20 L 56 48 L 68 68 L 48 56 L 20 92 L 32 54 L 14 44 L 44 38 Z" 
        fill={color}
        filter="url(#starGlowExact)"
      />
    </svg>
  );
}
