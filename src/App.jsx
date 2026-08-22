import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import LookDetail from './pages/LookDetail';
import Admin from './pages/Admin';
import { INITIAL_LOOKS } from './data/initialData';
import { Instagram, ArrowUp } from './components/Icons';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'look_detail' | 'admin'
  const [selectedLook, setSelectedLook] = useState(null);
  
  // Load looks from localStorage or fallback to INITIAL_LOOKS
  const [looks, setLooks] = useState(() => {
    const saved = localStorage.getItem('starboy_looks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler localStorage', e);
      }
    }
    return INITIAL_LOOKS;
  });

  // Save looks to localStorage on state update
  useEffect(() => {
    localStorage.setItem('starboy_looks', JSON.stringify(looks));
  }, [looks]);

  const handleSelectLook = (look) => {
    setSelectedLook(look);
    setCurrentView('look_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedLook(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sticky Y2K Navigation Header */}
      <Header 
        currentView={currentView} 
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view === 'home') setSelectedLook(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        looksCount={looks.length}
      />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {currentView === 'home' && (
          <Home 
            looks={looks} 
            onSelectLook={handleSelectLook} 
          />
        )}

        {currentView === 'look_detail' && (
          <LookDetail 
            look={selectedLook} 
            onBack={handleBackToHome} 
          />
        )}

        {currentView === 'admin' && (
          <Admin 
            looks={looks} 
            setLooks={setLooks} 
          />
        )}
      </main>

      {/* Floating Scroll-to-Top Button */}
      <button 
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#000000',
          border: 'none',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          zIndex: 90,
          transition: 'all 0.2s ease'
        }}
        className="hover:scale-110"
        title="Voltar ao Topo"
      >
        <ArrowUp size={20} />
      </button>

      {/* Y2K Dark Footer */}
      <footer style={{
        background: '#040405',
        borderTop: '1px solid var(--border-light)',
        padding: '32px 20px',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '2px', fontSize: '1.1rem' }}>
              STARBOY STREETWEAR
            </span>
            <span style={{ fontSize: '1rem' }}>✦</span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
            Plataforma oficial de achados de peças de roupas da Shein para os seguidores do Instagram.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <a 
              href="https://instagram.com/starboy_brazil" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-chrome)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Instagram size={16} />
              <span>@starboy_brazil</span>
            </a>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '12px' }}>
            © {new Date().getFullYear()} STARBOY STREETWEAR • Todos os direitos reservados. Prontinho para Vercel.
          </div>
        </div>
      </footer>
    </div>
  );
}
