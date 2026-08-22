import React, { useState } from 'react';
import { Search, Sparkles, Grid, Star } from '../components/Icons';
import LookCard from '../components/LookCard';

export default function Home({ looks, onSelectLook }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Streetwear', 'Masculino', 'Feminino', 'Dark', 'Acessórios'];

  // Filter looks by search term (look number, piece title, shein code) and category
  const filteredLooks = looks.filter(look => {
    const matchesSearch = 
      look.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      look.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `look n#${look.number}`.includes(searchTerm.toLowerCase()) ||
      look.pieces?.some(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sheinCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory === 'Todos' || look.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 60px' }}>
      
      {/* Hero Header Section */}
      <div style={{
        textAlign: 'center',
        padding: '36px 20px',
        marginBottom: '32px',
        background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 70%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Y2K Star Accents */}
        <div style={{ position: 'absolute', top: '15px', left: '20px', color: 'rgba(255,255,255,0.2)', fontSize: '1.5rem' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '15px', right: '20px', color: 'rgba(255,255,255,0.2)', fontSize: '1.5rem' }}>✦</div>

        <div className="star-badge" style={{ marginBottom: '12px' }}>
          ✦ STARBOY_BRAZIL OFFICIAL ✦
        </div>

        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
          fontWeight: 900,
          letterSpacing: '2px',
          color: '#ffffff',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          ACHADOS SHEIN
        </h1>

        <p style={{ 
          color: 'var(--text-muted)', 
          maxWidth: '550px', 
          margin: '0 auto 24px', 
          fontSize: '0.95rem' 
        }}>
          Encontre os links diretos de todas as peças de roupas e acessórios dos looks postados no nosso Instagram.
        </p>

        {/* Search Bar */}
        <div style={{ 
          maxWidth: '500px', 
          margin: '0 auto',
          position: 'relative'
        }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input 
            type="text"
            placeholder="Buscar por nº do Look ou Código Shein (ex: NQF5PV7)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 46px',
              background: 'rgba(15, 15, 20, 0.9)',
              border: '1px solid var(--border-light)',
              borderRadius: '30px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              transition: 'all 0.25s ease'
            }}
            className="focus:border-white focus:ring-1 focus:ring-white"
          />
          {searchTerm && (
            <button 
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
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '24px',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #ffffff' : '1px solid var(--border-light)',
              background: selectedCategory === cat ? '#ffffff' : 'rgba(255,255,255,0.04)',
              color: selectedCategory === cat ? '#000000' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Looks Grid Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={16} color="var(--text-muted)" />
          <h2 style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.9rem', 
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            TODOS OS LOOKS ({filteredLooks.length})
          </h2>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Fotos no formato 4:5
        </span>
      </div>

      {/* 4:5 Grid Section */}
      {filteredLooks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
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
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <Star size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Nenhum look encontrado</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tente buscar por outro termo ou limpar a barra de pesquisa.
          </p>
        </div>
      )}
    </div>
  );
}
