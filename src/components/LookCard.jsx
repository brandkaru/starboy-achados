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
