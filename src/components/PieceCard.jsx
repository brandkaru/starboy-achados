import React from 'react';
import { ExternalLink } from './Icons';

export default function PieceCard({ piece }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* 4:5 Aspect Ratio Photo Container */}
      <div className="aspect-4-5">
        <img 
          src={piece.image} 
          alt="Peça do Look" 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>

      {/* Primary Action Button: Open Shein Link */}
      <div style={{ padding: '12px' }}>
        <a 
          href={piece.sheinUrl || `https://www.shein.com/search?keyword=${piece.sheinCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-btn"
          style={{
            width: '100%',
            textDecoration: 'none',
            fontSize: '0.85rem',
            padding: '12px'
          }}
        >
          <span>ABRIR NA SHEIN</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
