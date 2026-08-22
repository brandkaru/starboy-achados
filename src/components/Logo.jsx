import React from 'react';

export default function Logo({ size = 'medium', showSubtext = true, className = '' }) {
  // Dimensions based on size prop
  const dimensions = {
    small: { width: '150px', height: '60px' },
    medium: { width: '220px', height: '90px' },
    large: { width: '320px', height: '130px' }
  }[size] || { width: '220px', height: '90px' };

  return (
    <div 
      className={`logo-container ${className}`}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: dimensions.width,
        height: dimensions.height,
        position: 'relative'
      }}
    >
      <svg 
        viewBox="0 0 500 250" 
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Chrome Metallic Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        <g transform="translate(0, 0)">
          {/* Top Orbital Arc */}
          <path 
            d="M 110 135 C 100 45, 340 10, 425 45 C 445 53, 380 30, 260 40 C 150 50, 85 90, 110 135 Z" 
            fill="url(#chromeGradient)" 
            filter="url(#logoGlow)"
          />

          {/* Bottom Orbital Arc */}
          <path 
            d="M 90 145 C 60 195, 120 225, 250 215 C 390 205, 455 135, 395 80 C 380 65, 400 110, 345 160 C 265 230, 110 220, 90 145 Z" 
            fill="url(#chromeGradient)" 
            filter="url(#logoGlow)"
          />

          {/* Top-Right 4-Point Spark Star */}
          <g transform="translate(265, 32) scale(0.95)">
            <path d="M 0 -24 Q 0 0 -24 0 Q 0 0 0 24 Q 0 0 24 0 Q 0 0 0 -24 Z" fill="#ffffff" />
            <line x1="0" y1="-32" x2="0" y2="32" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="-32" y1="0" x2="32" y2="0" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bottom-Center 4-Point Spark Star */}
          <g transform="translate(245, 198) scale(0.95)">
            <path d="M 0 -24 Q 0 0 -24 0 Q 0 0 0 24 Q 0 0 24 0 Q 0 0 0 -24 Z" fill="#ffffff" />
            <line x1="0" y1="-32" x2="0" y2="32" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="-32" y1="0" x2="32" y2="0" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Main Typography: ST★RBOY */}
          <text 
            x="250" 
            y="126" 
            textAnchor="middle" 
            fontFamily="'Syne', 'Orbitron', 'Impact', sans-serif" 
            fontWeight="900" 
            fontSize="54" 
            fill="#ffffff" 
            letterSpacing="2"
            filter="url(#logoGlow)"
          >
            ST<tspan fill="#ffffff" font-size="46" dy="-5">★</tspan><tspan dy="5">RBOY</tspan>
          </text>

          {/* Subtext: STREETWEAR */}
          {showSubtext && (
            <text 
              x="250" 
              y="154" 
              textAnchor="middle" 
              fontFamily="'Space Grotesk', 'Orbitron', sans-serif" 
              fontWeight="800" 
              fontSize="16" 
              fill="#e2e8f0" 
              letterSpacing="12"
            >
              STREETWEAR
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
