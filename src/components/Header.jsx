import React from 'react';
import { Instagram, ArrowLeft } from './Icons';
import StarLogo from './StarLogo';

export default function Header({ currentView, setCurrentView, looksCount }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-light)',
      padding: '10px 16px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '12px'
      }}>
        {/* Brand Logo & Name Section */}
        <div 
          onClick={() => setCurrentView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="STARBOY STREETWEAR"
        >
          <StarLogo size={32} color="#ffffff" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '0.95rem', 
              fontWeight: 800, 
              letterSpacing: '1px', 
              color: '#ffffff',
              lineHeight: 1
            }}>
              STARBOY STREETWEAR
            </span>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.58rem', 
              letterSpacing: '2px', 
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              ACHADOS SHEIN
            </span>
          </div>
        </div>

        {/* Right Section: Instagram Icon Only on Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {currentView === 'admin' ? (
            <button 
              onClick={() => {
                window.location.hash = '';
                setCurrentView('home');
              }}
              className="y2k-btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              <ArrowLeft size={13} />
              <span>VOLTAR</span>
            </button>
          ) : (
            <a 
              href="https://instagram.com/starboy_brazil" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram @starboy_brazil"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.2s ease',
                width: '38px',
                height: '38px'
              }}
              title="@starboy_brazil no Instagram"
            >
              <Instagram size={18} color="#ffffff" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
