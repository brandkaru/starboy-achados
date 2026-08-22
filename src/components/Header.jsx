import React from 'react';
import { Instagram, Sparkles, ShieldCheck, Home } from './Icons';

export default function Header({ currentView, setCurrentView, looksCount }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-light)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo Section */}
        <div 
          onClick={() => setCurrentView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          {/* Y2K Starboy Orbit SVG Logo */}
          <div style={{ position: 'relative', width: '46px', height: '46px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="#ffffff" strokeWidth="3" transform="rotate(-25 50 50)" />
              <path d="M50 15 L53 42 L80 45 L55 58 L65 85 L50 68 L35 85 L45 58 L20 45 L47 42 Z" fill="#ffffff" />
            </svg>
          </div>

          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '2px', 
              color: '#ffffff',
              lineHeight: 1.1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              STARBOY <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>✦</span>
            </div>
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.65rem', 
              letterSpacing: '3px', 
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              STREETWEAR • ACHADOS SHEIN
            </div>
          </div>
        </div>

        {/* Center / Social Link */}
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
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease'
          }}
          className="hover:border-white"
        >
          <Instagram size={14} color="#e2e8f0" />
          <span>@starboy_brazil</span>
        </a>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setCurrentView('home')}
            className={currentView === 'home' ? 'y2k-btn' : 'y2k-btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <Home size={14} />
            <span>FEED ({looksCount})</span>
          </button>

          <button 
            onClick={() => setCurrentView('admin')}
            className={currentView === 'admin' ? 'y2k-btn' : 'y2k-btn-secondary'}
            style={{ 
              fontSize: '0.8rem', 
              padding: '8px 16px',
              borderColor: currentView === 'admin' ? '#ffffff' : 'rgba(255,255,255,0.2)'
            }}
          >
            <ShieldCheck size={14} />
            <span>PAINEL ADM</span>
          </button>
        </div>
      </div>
    </header>
  );
}
