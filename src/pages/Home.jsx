import React, { useState } from 'react';
import { Search, Grid } from '../components/Icons';
import LookCard from '../components/LookCard';
import StarLogo from '../components/StarLogo';

export default function Home({ looks, onSelectLook }) {
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
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      >
        {/* Star Icon Centered */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <StarLogo size={70} color="#ffffff" className="hero-star" />
        </div>

        <div className="star-badge" style={{ marginBottom: '14px' }}>
          ✦ SELEÇÃO EXCLUSIVA DE LOOKS ✦
        </div>

        {/* Main Title */}
        <h1 
          className="hero-title"
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', 
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '8px',
            lineHeight: 1.15,
            maxWidth: '100%',
            wordBreak: 'break-word'
          }}
        >
          ENCONTRE AS PEÇAS DO SEU OUTFIT
        </h1>

        <p style={{ 
          color: 'var(--text-muted)', 
          maxWidth: '520px', 
          margin: '0 auto 24px', 
          fontSize: '0.85rem',
          lineHeight: 1.5
        }}>
          Links diretos de compra na Shein para todas as peças de roupas e acessórios dos looks postados no nosso Instagram.
        </p>

        {/* Search Bar Form */}
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
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input 
            type="search"
            enterKeyHint="search"
            placeholder="Buscar por nº do Look (ex: 1, LOOK N#1)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              background: 'rgba(15, 15, 20, 0.9)',
              border: '1px solid var(--border-light)',
              borderRadius: '30px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              transition: 'all 0.25s ease'
            }}
          />
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ✕ Limpar
            </button>
          )}
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
            {searchTerm ? `RESULTADOS DA BUSCA (${filteredLooks.length})` : `TODOS OS LOOKS (${filteredLooks.length})`}
          </h2>
        </div>
      </div>

      {/* 4:5 Grid Section */}
      {filteredLooks.length > 0 ? (
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
