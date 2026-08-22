import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from './Icons';

export default function PieceCard({ piece, lookTitle }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (piece.sheinCode) {
      navigator.clipboard.writeText(piece.sheinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          alt={piece.title} 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Top Overlay Brand Logo */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '4px 10px',
          borderRadius: '2px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '0.65rem',
            color: '#000000',
            letterSpacing: '1px'
          }}>
            STARBOY
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: '#333333',
            letterSpacing: '1px'
          }}>
            STREETWEAR
          </div>
        </div>

        {/* Vertical Side Watermark (LOOK N#9 style) */}
        <div style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 800,
          fontSize: '0.65rem',
          color: '#000000',
          letterSpacing: '2px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2px 6px',
          borderRadius: '2px'
        }}>
          LOOK
        </div>

        {/* Shein Code Badge Overlay */}
        {piece.sheinCode && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>ID: {piece.sheinCode}</span>
          </div>
        )}
      </div>

      {/* Piece Info & Actions */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              color: '#ffffff',
              lineHeight: 1.3
            }}>
              {piece.title}
            </h3>

            {piece.category && (
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap'
              }}>
                {piece.category}
              </span>
            )}
          </div>
        </div>

        {/* ID Copy Button */}
        {piece.sheinCode && (
          <button 
            onClick={handleCopyCode}
            style={{
              width: '100%',
              background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.5)' : 'var(--border-light)'}`,
              color: copied ? '#4ade80' : 'var(--text-muted)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>CÓDIGO COPIADO!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>COPIAR CÓDIGO: {piece.sheinCode}</span>
              </>
            )}
          </button>
        )}

        {/* Primary Action Button: Open Shein Link */}
        <a 
          href={piece.sheinUrl || `https://www.shein.com/search?keyword=${piece.sheinCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-btn"
          style={{
            marginTop: 'auto',
            width: '100%',
            textDecoration: 'none',
            fontSize: '0.85rem'
          }}
        >
          <span>ABRIR NA SHEIN</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
