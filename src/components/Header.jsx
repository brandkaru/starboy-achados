import React from 'react';
import { Instagram, Home, ArrowLeft } from './Icons';
import StarLogo from './StarLogo';

export default function Header({ currentView, setCurrentView, looksCount }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-light)',
      padding: '12px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo & Name Section */}
        <div 
          onClick={() => setCurrentView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="STARBOY STREETWEAR"
        >
          <StarLogo size={36} color="#ffffff" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.05rem', 
              fontWeight: 800, 
              letterSpacing: '1px', 
              color: '#ffffff',
              lineHeight: 1
            }}>
              STARBOY STREETWEAR
            </span>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.6rem', 
              letterSpacing: '2px', 
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              ACHADOS SHEIN
            </span>
          </div>
        </div>

        {/* Right Section: Instagram & Admin Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentView === 'admin' ? (
            <button 
              onClick={() => {
                window.location.hash = '';
                setCurrentView('home');
              }}
              className="y2k-btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
            >
              <ArrowLeft size={13} />
              <span>VOLTAR AO SITE</span>
            </button>
          ) : (
            <a 
              href="https://instagram.com/starboy_brazil" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-chrome)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <Instagram size={14} color="#e2e8f0" />
              <span>@starboy_brazil</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
