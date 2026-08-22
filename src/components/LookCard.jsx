import React from 'react';
import { ArrowRight, Layers } from './Icons';

export default function LookCard({ look, onSelectLook }) {
  return (
    <div 
      onClick={() => onSelectLook(look)}
      style={{
        cursor: 'pointer',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      className="group hover:border-white hover:-translate-y-1"
    >
      {/* 4:5 Instagram Container */}
      <div className="aspect-4-5">
        <img 
          src={look.coverImage} 
          alt={look.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Top Left Watermark: "ACHADOS SHEIN" */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.92)',
          color: '#000000',
          padding: '4px 8px',
          borderRadius: '2px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '0.7rem',
          letterSpacing: '1px',
          lineHeight: 1.1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          textTransform: 'uppercase'
        }}>
          <div>ACHADOS</div>
          <div style={{ fontSize: '0.85rem' }}>SHEIN</div>
        </div>

        {/* Bottom Left Label: "LOOK N#X" */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          fontFamily: 'var(--font-mono)',
          color: '#000000',
          fontWeight: 800,
          fontSize: '0.75rem',
          letterSpacing: '1px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2px 6px',
          borderRadius: '2px'
        }}>
          {look.title || `LOOK N#${look.number}`}
        </div>

        {/* Bottom Right Instagram Graphic: Black Y2K Star */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          color: '#000000',
          fontSize: '1.6rem',
          lineHeight: 1,
          filter: 'drop-shadow(0px 0px 3px rgba(255,255,255,0.8))'
        }}>
          ✦
        </div>

        {/* Hover Overlay Button */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.25s ease'
          }}
          className="hover:opacity-100"
        >
          <div className="y2k-btn" style={{ fontSize: '0.75rem', padding: '10px 18px' }}>
            VER PEÇAS ({look.pieces?.length || 0}) <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            color: '#ffffff'
          }}>
            {look.title || `LOOK N#${look.number}`}
          </span>

          <span style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Layers size={12} />
            {look.pieces?.length || 0} {look.pieces?.length === 1 ? 'peça' : 'peças'}
          </span>
        </div>

        {look.subtitle && (
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)', 
            marginTop: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {look.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
