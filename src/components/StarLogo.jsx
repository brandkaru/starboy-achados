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
      <path 
        d="M 52 4 L 42 34 L 96 22 L 54 50 L 66 70 L 46 56 L 16 98 L 30 54 L 8 42 L 42 38 Z" 
        fill={color}
      />
    </svg>
  );
}
