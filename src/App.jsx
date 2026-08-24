import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import LookDetail from './pages/LookDetail';
import Admin from './pages/Admin';
import { INITIAL_LOOKS } from './data/initialData';
import { Instagram, ArrowUp } from './components/Icons';
import { getCloudLooks } from './services/cloudDb';
import StarLogo from './components/StarLogo';

export default function App() {
  // Purge legacy local storage masks on startup so all browsers sync 100% with the Oracle VPS Server
  useEffect(() => {
    try {
      localStorage.removeItem('starboy_deleted_looks');
      localStorage.removeItem('starboy_looks');
    } catch (e) {}
  }, []);

  // Secret routing check: Only opens admin if URL has secret key #sb96, #manage, or ?key=sb96
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash === '#sb96' || hash === '#manage' || search.includes('key=sb96') || search.includes('admin=sb96')) {
      return 'admin';
    }
    return 'home';
  });

  const [selectedLook, setSelectedLook] = useState(null);

  // Pure Server Single Source of Truth State
  const [looks, setLooks] = useState(() => {
    return Array.isArray(INITIAL_LOOKS) ? INITIAL_LOOKS : [];
  });

  // Deep link detection for specific look URLs (?look=2 or #look-2)
  useEffect(() => {
    const checkDeepLink = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const lookParam = searchParams.get('look') || searchParams.get('id');
      const hashParam = window.location.hash.startsWith('#look-') ? window.location.hash.replace('#look-', '') : null;
      
      const targetRef = lookParam || hashParam;
      if (targetRef && looks && looks.length > 0) {
        const found = looks.find(l => 
          String(l.number) === String(targetRef) || 
          String(l.id) === String(targetRef) ||
          String(l.id) === `look-${targetRef}`
        );
        if (found) {
          setSelectedLook(found);
          setCurrentView('look_detail');
        }
      }
    };

    checkDeepLink();
  }, [looks]);

  // Listen to hash/search changes for secret admin access & deep links
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#sb96' || hash === '#manage' || search.includes('key=sb96') || search.includes('admin=sb96')) {
        setCurrentView('admin');
      } else if (!hash && !search.includes('key=') && !search.includes('look=')) {
        if (currentView === 'admin' || currentView === 'look_detail') {
          setCurrentView('home');
          setSelectedLook(null);
        }
      }
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [currentView]);

  // Auto-sync with Oracle VPS Server Cloud Database on mount & tab focus
  useEffect(() => {
    const syncCloud = async () => {
      try {
        const cloudLooks = await getCloudLooks();
        if (cloudLooks && Array.isArray(cloudLooks)) {
          setLooks(cloudLooks);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar com a VPS Oracle:', err);
      }
    };

    syncCloud();
    window.addEventListener('focus', syncCloud);
    return () => window.removeEventListener('focus', syncCloud);
  }, []);

  const handleSelectLook = (look) => {
    setSelectedLook(look);
    setCurrentView('look_detail');
    const lookRef = look.number || look.id;
    try {
      window.history.pushState(null, '', `?look=${lookRef}`);
    } catch (e) {
      window.location.hash = `look-${lookRef}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedLook(null);
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch (e) {
      window.location.hash = '';
    }
    // Re-fetch from Oracle VPS Cloud DB on return to Home
    getCloudLooks().then(cloudLooks => {
      if (cloudLooks && Array.isArray(cloudLooks)) setLooks(cloudLooks);
    });
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
          if (view === 'home') {
            handleBackToHome();
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
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
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <StarLogo size={42} color="#ffffff" />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '2px', fontSize: '1.1rem' }}>
              STARBOY STREETWEAR
            </span>
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
            © {new Date().getFullYear()} STARBOY STREETWEAR • Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
