import React from 'react';
import { ArrowLeft, ShoppingBag, Layers, Share2, Check } from '../components/Icons';
import PieceCard from '../components/PieceCard';

export default function LookDetail({ look, onBack }) {
  const [shareCopied, setShareCopied] = React.useState(false);

  if (!look) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 60px' }}>
      
      {/* Top Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <button 
          onClick={onBack}
          className="y2k-btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>VOLTAR PARA O FEED</span>
        </button>

        <button 
          onClick={handleShare}
          className="y2k-btn-secondary"
          style={{ fontSize: '0.8rem' }}
        >
          {shareCopied ? (
            <>
              <Check size={14} color="#4ade80" />
              <span style={{ color: '#4ade80' }}>LINK COPIADO!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>COMPARTILHAR LOOK</span>
            </>
          )}
        </button>
      </div>

      {/* Look Banner Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '24px',
        marginBottom: '36px',
        alignItems: 'center'
      }}>
        {/* Look Cover 4:5 Preview */}
        <div style={{ maxWidth: '320px', width: '100%', margin: '0 auto' }}>
          <div className="aspect-4-5" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <img src={look.coverImage} alt={look.title} />

          </div>
        </div>

        {/* Look Meta Info */}
        <div>

          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            {look.title || `LOOK N#${look.number}`}
          </h1>

          {look.subtitle && (
            <p style={{ 
              fontSize: '1.05rem', 
              color: 'var(--text-muted)', 
              marginBottom: '20px' 
            }}>
              {look.subtitle}
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
            width: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <Layers size={16} />
              <span>{look.pieces?.length || 0} PEÇAS NESSE LOOK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pieces Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} color="#ffffff" />
          <h2 style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '1.1rem', 
            letterSpacing: '1px',
            color: '#ffffff'
          }}>
            PEÇAS E LINKS DA SHEIN
          </h2>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Clique no botão para abrir o item
        </span>
      </div>

      {/* Grid of Piece Cards */}
      {look.pieces && look.pieces.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {look.pieces.map((piece) => (
            <PieceCard 
              key={piece.id} 
              piece={piece} 
              lookTitle={look.title} 
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)'
        }}>
          Nenhuma peça cadastrada para este look ainda.
        </div>
      )}
    </div>
  );
}
