import React, { useState } from 'react';
import { Search, Grid } from '../components/Icons';
import LookCard from '../components/LookCard';
import StarLogo from '../components/StarLogo';

export default function Home({ looks, isLoading, onSelectLook }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort looks: Latest created / highest look number FIRST (Top of Home Page)
  const sortedLooks = [...(looks || [])].sort((a, b) => {
    const numA = Number(a?.number) || 0;
    const numB = Number(b?.number) || 0;
    if (numA !== numB) return numB - numA;

    const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Look Number ONLY Search Filter
  const filteredLooks = sortedLooks.filter(look => {
    if (!look) return false;
    if (!searchTerm || !searchTerm.trim()) return true;
    
    // Extract numbers from input e.g. "look 1", "#1", "1", "look n#1" -> "1"
    const inputDigits = searchTerm.trim().replace(/\D/g, '');
    const lookNumberStr = String(look.number ?? '');

    if (inputDigits) {
      return lookNumberStr === inputDigits || lookNumberStr.includes(inputDigits);
    }
    
    return false;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px 60px' }}>
      
      {/* Hero Banner Section */}
      <div 
        className="hero-container"
        style={{
          textAlign: 'center',
          padding: '40px 16px 32px',
          marginBottom: '28px',
          background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 70%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '16px' }}>
          <StarLogo size={56} color="#ffffff" style={{ transform: 'translateX(3px)' }} />
        </div>

        <div style={{ display: 'inline-block', marginBottom: '12px' }}>
          <span className="star-badge">✦ SELEÇÃO EXCLUSIVA DE LOOKS ✦</span>
        </div>

        <h1 
          className="hero-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '2px',
            lineHeight: 1.1,
            color: '#ffffff',
            margin: '0 auto 12px',
            maxWidth: '800px',
            textTransform: 'uppercase'
          }}
        >
          ENCONTRE AS PEÇAS DO SEU OUTFIT
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          maxWidth: '540px',
          margin: '0 auto 24px',
          lineHeight: 1.5
        }}>
          Links diretos de compra na Shein para todas as peças de roupas e acessórios dos looks postados no nosso Instagram.
        </p>

        {/* Look Number ONLY Search Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const gridEl = document.getElementById('looks-grid-header');
            if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search 
              size={18} 
              color="var(--text-muted)" 
              style={{
                position: 'absolute',
                left: '16px',
                pointerEvents: 'none',
                zIndex: 2
              }} 
            />
            <input 
              type="search"
              placeholder="Buscar por nº do Look (ex: 1, LOOK N#1)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              enterKeyHint="search"
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-chrome)';
                e.target.style.background = 'rgba(255, 255, 255, 0.07)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-light)';
                e.target.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            />
          </div>
        </form>
      </div>

      {/* Looks Grid Header */}
      <div 
        id="looks-grid-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={16} color="var(--text-muted)" />
          <h2 style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.85rem', 
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            {isLoading ? 'CARREGANDO LOOKS... ✦' : searchTerm ? `RESULTADOS DA BUSCA (${filteredLooks.length})` : `TODOS OS LOOKS (${filteredLooks.length})`}
          </h2>
        </div>
      </div>

      {/* 4:5 Grid Section or Loading Skeleton */}
      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '14px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div 
              key={n}
              style={{
                aspectRatio: '4/5',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                minHeight: '220px'
              }}
            />
          ))}
        </div>
      ) : filteredLooks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '14px'
        }}>
          {filteredLooks.map((look) => (
            <LookCard 
              key={look.id} 
              look={look} 
              onSelectLook={onSelectLook} 
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
            Nenhum look encontrado para "{searchTerm}".
          </p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="y2k-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Ver Todos os Looks
          </button>
        </div>
      )}
    </div>
  );
}
