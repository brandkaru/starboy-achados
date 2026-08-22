import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit2, Download, 
  Lock, Unlock, Check, ImageIcon, 
  Sparkles 
} from '../components/Icons';

export default function Admin({ looks, setLooks }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [lookNumber, setLookNumber] = useState(looks.length + 1);
  const [lookTitle, setLookTitle] = useState(`LOOK N#${looks.length + 1}`);
  const [lookSubtitle, setLookSubtitle] = useState('');
  const [lookCategory, setLookCategory] = useState('Streetwear');
  const [coverImage, setCoverImage] = useState('');
  
  // Pieces State
  const [pieces, setPieces] = useState([
    { id: '1', title: '', sheinCode: '', sheinUrl: '', image: '', category: 'Calças' }
  ]);

  const categories = ['Streetwear', 'Masculino', 'Feminino', 'Dark', 'Acessórios'];
  const pieceCategories = ['Camisas', 'Tops', 'Calças', 'Bermudas', 'Casacos', 'Calçados', 'Acessórios', 'Bolsas'];

  // Handle PIN Login (Default PIN: "1234" or "starboy")
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === 'starboy' || pinInput === '1234' || pinInput === '') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Image File Handler (converts uploaded image file to Data URL for instant rendering & localStorage)
  const handleImageUpload = (file, callback) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Piece Row
  const addPieceRow = () => {
    setPieces([
      ...pieces,
      { id: Date.now().toString(), title: '', sheinCode: '', sheinUrl: '', image: '', category: 'Camisas' }
    ]);
  };

  // Remove Piece Row
  const removePieceRow = (index) => {
    if (pieces.length > 1) {
      setPieces(pieces.filter((_, i) => i !== index));
    }
  };

  // Update Piece Field
  const updatePieceField = (index, field, value) => {
    const updated = [...pieces];
    updated[index][field] = value;
    setPieces(updated);
  };

  // Submit Form (Create or Edit Look)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert('Por favor, adicione uma foto de capa 4:5 para o Look!');
      return;
    }

    const newLook = {
      id: isEditing ? editingId : `look-${Date.now()}`,
      number: Number(lookNumber),
      title: lookTitle || `LOOK N#${lookNumber}`,
      subtitle: lookSubtitle,
      category: lookCategory,
      coverImage: coverImage,
      createdAt: new Date().toISOString().split('T')[0],
      pieces: pieces.map((p, idx) => ({
        id: p.id || `p-${Date.now()}-${idx}`,
        title: p.title || `Peça ${idx + 1}`,
        sheinCode: p.sheinCode?.trim() || '',
        sheinUrl: p.sheinUrl?.trim() || `https://www.shein.com/search?keyword=${p.sheinCode}`,
        image: p.image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
        category: p.category || 'Streetwear'
      }))
    };

    if (isEditing) {
      setLooks(looks.map(l => l.id === editingId ? newLook : l));
      setIsEditing(false);
      setEditingId(null);
      alert('Look atualizado com sucesso! ✦');
    } else {
      setLooks([newLook, ...looks]);
      alert('Novo Look publicado com sucesso! ✦');
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    const nextNum = looks.length + 1;
    setLookNumber(nextNum);
    setLookTitle(`LOOK N#${nextNum}`);
    setLookSubtitle('');
    setLookCategory('Streetwear');
    setCoverImage('');
    setPieces([{ id: '1', title: '', sheinCode: '', sheinUrl: '', image: '', category: 'Calças' }]);
    setIsEditing(false);
    setEditingId(null);
  };

  // Edit Existing Look
  const handleEdit = (look) => {
    setIsEditing(true);
    setEditingId(look.id);
    setLookNumber(look.number);
    setLookTitle(look.title);
    setLookSubtitle(look.subtitle || '');
    setLookCategory(look.category || 'Streetwear');
    setCoverImage(look.coverImage);
    setPieces(look.pieces?.length > 0 ? look.pieces : [{ id: '1', title: '', sheinCode: '', sheinUrl: '', image: '', category: 'Calças' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Look
  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este Look?')) {
      setLooks(looks.filter(l => l.id !== id));
    }
  };

  // Export Data JSON for Vercel / Repo Backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(looks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `starboy_looks_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Lock Screen Render
  if (!isAuthenticated) {
    return (
      <div style={{
        maxWidth: '450px',
        margin: '60px auto',
        padding: '32px 24px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          border: '1px solid var(--border-light)'
        }}>
          <Lock size={24} color="#ffffff" />
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px', marginBottom: '8px' }}>
          PAINEL DE ADMINISTRAÇÃO
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Área exclusiva para postar novos looks e atualizar os links dos produtos Shein.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password"
            placeholder="Digite o PIN de acesso (ou deixe em branco)..."
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${pinError ? '#ef4444' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />

          {pinError && (
            <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              PIN incorreto. Tente "starboy" ou deixe em branco.
            </p>
          )}

          <button type="submit" className="y2k-btn">
            <span>ACESSAR PAINEL</span>
            <Unlock size={16} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 60px' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div className="star-badge" style={{ marginBottom: '6px' }}>✦ PAINEL ADMINISTRATIVO</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', letterSpacing: '1px' }}>
            GERENCIADOR DE LOOKS & LINKS
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportJSON} className="y2k-btn-secondary" title="Baixar dados em JSON">
            <Download size={14} />
            <span>EXPORTAR BACKUP JSON</span>
          </button>

          <button onClick={() => setIsAuthenticated(false)} className="y2k-btn-secondary">
            <Lock size={14} />
            <span>SAIR</span>
          </button>
        </div>
      </div>

      {/* Main Form Box: Create / Edit Look */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '28px',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles color="#ffffff" size={20} />
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '1px' }}>
            {isEditing ? 'EDITAR LOOK EXISTENTE' : 'POSTAR NOVO LOOK (CAPA + PEÇAS)'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Info Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                NÚMERO DO LOOK
              </label>
              <input 
                type="number" 
                value={lookNumber}
                onChange={(e) => {
                  setLookNumber(e.target.value);
                  setLookTitle(`LOOK N#${e.target.value}`);
                }}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                TÍTULO DO LOOK
              </label>
              <input 
                type="text" 
                placeholder="Ex: LOOK N#10"
                value={lookTitle}
                onChange={(e) => setLookTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                CATEGORIA DO LOOK
              </label>
              <select
                value={lookCategory}
                onChange={(e) => setLookCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff'
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              SUBTÍTULO / DESCRIÇÃO CURTA
            </label>
            <input 
              type="text" 
              placeholder="Ex: Streetwear Cyber Outfit com detalhes prateados"
              value={lookSubtitle}
              onChange={(e) => setLookSubtitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff'
              }}
            />
          </div>

          {/* Cover Image Upload 4:5 */}
          <div style={{
            border: '1px dashed var(--border-light)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              FOTO DE CAPA DO LOOK (Proporção 4:5)
            </label>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Cover Preview Box 4:5 */}
              <div style={{ width: '110px' }} className="aspect-4-5">
                {coverImage ? (
                  <img src={coverImage} alt="Capa Preview" />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], setCoverImage)}
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                />

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OU cole a URL da imagem abaixo:</span>

                <input 
                  type="url" 
                  placeholder="https://..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Pieces Section */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#ffffff', letterSpacing: '1px' }}>
                PEÇAS DO LOOK ({pieces.length})
              </h3>

              <button 
                type="button" 
                onClick={addPieceRow}
                className="y2k-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>ADICIONAR OUTRA PEÇA</span>
              </button>
            </div>

            {/* List of Pieces Form Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pieces.map((piece, index) => (
                <div 
                  key={piece.id || index}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      PEÇA #{index + 1}
                    </span>

                    {pieces.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removePieceRow(index)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Remover Peça"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {/* Piece Title */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        NOME DA PEÇA
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Calça Track Pants COURAGEOUS"
                        value={piece.title}
                        onChange={(e) => updatePieceField(index, 'title', e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'rgba(15,15,20,0.8)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    {/* Shein Code / ID */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        CÓDIGO/ID SHEIN (ex: NQF5PV7)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: NQF5PV7"
                        value={piece.sheinCode}
                        onChange={(e) => updatePieceField(index, 'sheinCode', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'rgba(15,15,20,0.8)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#ffffff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    {/* Shein Product URL */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        LINK DA SHEIN (AFILIADO / DIRETO)
                      </label>
                      <input 
                        type="url" 
                        placeholder="https://shein.top/..."
                        value={piece.sheinUrl}
                        onChange={(e) => updatePieceField(index, 'sheinUrl', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: 'rgba(15,15,20,0.8)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Piece Photo Upload */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ width: '60px' }} className="aspect-4-5">
                      {piece.image ? (
                        <img src={piece.image} alt="Peça Preview" />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>

                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0], (dataUrl) => updatePieceField(index, 'image', dataUrl))}
                        style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      />

                      <input 
                        type="url" 
                        placeholder="URL da Foto da Peça..."
                        value={piece.image}
                        onChange={(e) => updatePieceField(index, 'image', e.target.value)}
                        style={{
                          padding: '6px 10px',
                          background: 'rgba(15,15,20,0.8)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#ffffff',
                          fontSize: '0.75rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            {isEditing && (
              <button type="button" onClick={resetForm} className="y2k-btn-secondary">
                CANCELAR EDIÇÃO
              </button>
            )}

            <button type="submit" className="y2k-btn">
              <span>{isEditing ? 'SALVAR ALTERAÇÕES ✦' : 'PUBLICAR LOOK ✦'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Looks Management List */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '28px'
      }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '20px', letterSpacing: '1px' }}>
          LOOKS PUBLICADOS ({looks.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {looks.map((look) => (
            <div 
              key={look.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '50px' }} className="aspect-4-5">
                  <img src={look.coverImage} alt={look.title} />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                    {look.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {look.pieces?.length || 0} peças cadastradas • {look.category}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEdit(look)} 
                  className="y2k-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Edit2 size={12} />
                  <span>EDITAR</span>
                </button>

                <button 
                  onClick={() => handleDelete(look.id)} 
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={12} />
                  <span>EXCLUIR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
