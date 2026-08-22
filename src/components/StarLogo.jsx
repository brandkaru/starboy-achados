import React from 'react';

// Official Identical Tilted Y2K Star Component
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
        d="M 54 8 L 60 32 L 92 22 L 66 48 L 68 65 L 50 56 L 22 91 L 35 52 L 15 44 L 44 34 Z" 
        fill={color}
      />
    </svg>
  );
}
