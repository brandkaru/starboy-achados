import React from 'react';
import { Instagram, ShieldCheck, Home } from './Icons';
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
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo & Name Section */}
        <div 
          onClick={() => setCurrentView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="STARBOY STREETWEAR"
        >
          <StarLogo size={34} color="#ffffff" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1rem', 
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

        {/* Center / Social Link (Hidden on mobile via CSS) */}
        <a 
          href="https://instagram.com/starboy_brazil" 
          target="_blank" 
          rel="noopener noreferrer"
          className="header-social-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-chrome)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            padding: '5px 12px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <Instagram size={14} color="#e2e8f0" />
          <span>@starboy_brazil</span>
        </a>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setCurrentView('home')}
            className={currentView === 'home' ? 'y2k-btn' : 'y2k-btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <Home size={13} />
            <span>FEED ({looksCount})</span>
          </button>

          <button 
            onClick={() => setCurrentView('admin')}
            className={currentView === 'admin' ? 'y2k-btn' : 'y2k-btn-secondary'}
            style={{ 
              fontSize: '0.75rem', 
              padding: '6px 12px',
              borderColor: currentView === 'admin' ? '#ffffff' : 'rgba(255,255,255,0.2)'
            }}
          >
            <ShieldCheck size={13} />
            <span>PAINEL ADM</span>
          </button>
        </div>
      </div>
    </header>
  );
}
