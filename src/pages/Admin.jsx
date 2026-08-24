import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit2, Download, 
  Lock, Unlock, Check, Copy, ImageIcon, 
  Sparkles, Star 
} from '../components/Icons';
import { saveLookToCloud, deleteLookFromCloud, getVpsUrl, setVpsUrl, syncAllLooksToVps } from '../services/cloudDb';

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
  const [lookCategory, setLookCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Pieces State
  const [pieces, setPieces] = useState([
    { id: '1', title: '', sheinCode: '', sheinUrl: '', image: '' }
  ]);

  // Meta Automation Texts Copy Feedback
  const [copiedType, setCopiedType] = useState(null);
  const [selectedAutomationLookId, setSelectedAutomationLookId] = useState(looks[0]?.id || '');

  // VPS Cloud Config State
  const [vpsInputUrl, setVpsInputUrl] = useState(() => getVpsUrl());
  const [vpsStatus, setVpsStatus] = useState(null);

  const handleSaveVpsUrl = async (e) => {
    e?.preventDefault();
    setVpsStatus({ type: 'testing', msg: 'Testando conexão com a VPS...' });
    
    const cleanUrl = vpsInputUrl.trim();
    if (!cleanUrl) {
      setVpsUrl('');
      setVpsStatus({ type: 'success', msg: 'URL da VPS removida. Usando servidor de fallback.' });
      return;
    }

    setVpsUrl(cleanUrl);
    
    try {
      const targetUrl = getVpsUrl();
      const res = await fetch(`${targetUrl}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setVpsStatus({ type: 'success', msg: `✓ Conectado com sucesso à VPS Oracle! (${data.service || 'API Online'})` });
        await syncAllLooksToVps(looks);
      } else {
        setVpsStatus({ type: 'error', msg: `VPS respondeu com status ${res.status}. Verifique se a porta 3001 está aberta.` });
      }
    } catch (err) {
      setVpsStatus({ type: 'error', msg: `Não foi possível conectar na VPS Oracle. (Erro: ${err.message})` });
    }
  };

  const handleSyncAllVps = async () => {
    setVpsStatus({ type: 'testing', msg: 'Enviando todos os looks para a VPS Oracle...' });
    const success = await syncAllLooksToVps(looks);
    if (success) {
      setVpsStatus({ type: 'success', msg: `✓ Sucesso! ${looks.length} looks gravados na nuvem da sua VPS Oracle!` });
    } else {
      setVpsStatus({ type: 'error', msg: 'Erro ao enviar dados para a VPS Oracle. Verifique se o servidor está online.' });
    }
  };

  // Handle PIN Login (Admin Password: "Ic@ro1996")
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === 'Ic@ro1996' || pinInput === 'starboy') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Canvas Image Compression Helper (Reduces 10MB phone camera photos to ~40KB)
  const compressImage = (file, maxWidth = 800, quality = 0.75) => {
    return new Promise((resolve) => {
      if (!file || typeof file === 'string') return resolve(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Single Image File Handler with Auto Compression
  const handleImageUpload = async (file, callback) => {
    if (file) {
      const compressed = await compressImage(file);
      callback(compressed);
    }
  };

  // BATCH MULTIPLE IMAGES UPLOAD HANDLER WITH AUTO COMPRESSION
  const handleBatchImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const compressedImages = await Promise.all(fileArray.map(file => compressImage(file)));

    if (compressedImages.length > 0) {
      setCoverImage(compressedImages[0]);

      if (compressedImages.length > 1) {
        const newPieces = compressedImages.slice(1).map((imgUrl, idx) => ({
          id: `batch-${Date.now()}-${idx}`,
          title: `Peça #${idx + 1}`,
          sheinCode: '',
          sheinUrl: '',
          image: imgUrl
        }));
        setPieces(newPieces);
      } else {
        setPieces([{ id: '1', title: 'Peça #1', sheinCode: '', sheinUrl: '', image: '' }]);
      }
    }
  };

  // Swap Cover with a Piece Photo in 1-click
  const setPhotoAsCover = (pieceIndex) => {
    const currentCover = coverImage;
    const selectedPieceImage = pieces[pieceIndex].image;

    setCoverImage(selectedPieceImage);

    const updatedPieces = [...pieces];
    if (currentCover) {
      updatedPieces[pieceIndex].image = currentCover;
    }
    setPieces(updatedPieces);
  };

  // Add Piece Row
  const addPieceRow = () => {
    setPieces([
      ...pieces,
      { id: Date.now().toString(), title: '', sheinCode: '', sheinUrl: '', image: '' }
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert('Por favor, selecione as fotos ou defina uma Foto de Capa 4:5 para o Look!');
      return;
    }

    const createdLookId = isEditing ? editingId : `look-${Date.now()}`;
    const newLook = {
      id: createdLookId,
      number: Number(lookNumber),
      title: lookTitle || `LOOK N#${lookNumber}`,
      subtitle: lookSubtitle,
      category: lookCategory,
      coverImage: coverImage,
      createdAt: new Date().toISOString().split('T')[0],
      pieces: pieces.map((p, idx) => ({
        id: p.id || `p-${Date.now()}-${idx}`,
        title: p.title || `Peça #${idx + 1}`,
        sheinCode: p.sheinCode?.trim() || '',
        sheinUrl: p.sheinUrl?.trim() || (p.sheinCode ? `https://www.shein.com/search?keyword=${p.sheinCode}` : ''),
        image: p.image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop'
      }))
    };

    if (isEditing) {
      const result = await saveLookToCloud(newLook);
      if (result) {
        setIsEditing(false);
        setEditingId(null);
        const cloudLooks = await getCloudLooks();
        if (cloudLooks && Array.isArray(cloudLooks)) setLooks(cloudLooks);
        alert('Look atualizado com sucesso no banco de dados na Nuvem! ✦');
      } else {
        alert('Erro ao salvar o look na nuvem. Verifique a conexão com a VPS Oracle!');
        return;
      }
    } else {
      const result = await saveLookToCloud(newLook);
      if (result) {
        setSelectedAutomationLookId(createdLookId);
        const cloudLooks = await getCloudLooks();
        if (cloudLooks && Array.isArray(cloudLooks)) setLooks(cloudLooks);
        alert('Novo Look publicado com sucesso no banco de dados na Nuvem! ✦');
      } else {
        alert('Erro ao salvar o look na nuvem. Verifique a conexão com a VPS Oracle!');
        return;
      }
    }

    resetForm();
  };

  const resetForm = () => {
    const nextNum = looks.length + 1;
    setLookNumber(nextNum);
    setLookTitle(`LOOK N#${nextNum}`);
    setLookSubtitle('');
    setLookCategory('');
    setCoverImage('');
    setPieces([{ id: '1', title: '', sheinCode: '', sheinUrl: '', image: '' }]);
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
    setLookCategory(look.category || '');
    setCoverImage(look.coverImage);
    setPieces(look.pieces?.length > 0 ? look.pieces : [{ id: '1', title: '', sheinCode: '', sheinUrl: '', image: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Look
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este Look?')) {
      const targetLook = looks.find(l => l.id === id || String(l.number) === String(id));
      const updated = looks.filter(l => l.id !== id && String(l.number) !== String(id));
      setLooks(updated);

      // Purge legacy local storage masks
      try {
        localStorage.removeItem('starboy_deleted_looks');
        localStorage.removeItem('starboy_looks');
      } catch (e) {}

      if (targetLook) {
        if (targetLook.id) await deleteLookFromCloud(targetLook.id);
        if (targetLook.number) await deleteLookFromCloud(targetLook.number);
      } else {
        await deleteLookFromCloud(id);
      }

      // Re-fetch from Oracle VPS Cloud Database to confirm single source of truth
      const cloudLooks = await getCloudLooks();
      if (cloudLooks && Array.isArray(cloudLooks)) {
        setLooks(cloudLooks);
      }
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

  // Import Data JSON to Sync Device Storage Instantaneously
  const handleImportJSON = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setLooks(importedData);
          alert(`✦ Sucesso! ${importedData.length} looks foram sincronizados para este dispositivo!`);
        } else {
          alert('Arquivo JSON inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Generate Automation Text for DM
  const getAutomationDMText = (targetLook) => {
    if (!targetLook) return '';
    const siteUrl = window.location.origin;
    
    // Construct piece links list if available
    let piecesListText = '';
    if (targetLook.pieces && targetLook.pieces.length > 0) {
      piecesListText = targetLook.pieces
        .filter(p => p.sheinUrl)
        .map((p, i) => `▪ Peça ${i + 1}: ${p.sheinUrl}`)
        .join('\n');
    }

    return `Oii! Tudo bem? ✦ Aqui estão os links das peças do ${targetLook.title || `LOOK N#${targetLook.number}`}:\n\n` +
      (piecesListText ? `${piecesListText}\n\n` : '') +
      `🔗 Veja todas as peças com fotos no site:\n${siteUrl}\n\n✦ STARBOY STREETWEAR`;
  };

  // Generate Automation Text for Instagram Public Comments Reply
  const getAutomationCommentText = (targetLook) => {
    if (!targetLook) return '';
    return `Oii! ✦ Acabei de enviar os links do ${targetLook.title || `LOOK N#${targetLook.number}`} direto no seu Direct! Confere lá nas suas DMs 📥✨`;
  };

  // Copy helper
  const handleCopyAutomation = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedType(key);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const activeAutomationLook = looks.find(l => l.id === selectedAutomationLookId) || looks[0];

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
          Área exclusiva para postar novos looks e gerenciar links e automações.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="password"
            placeholder="Digite a senha de administrador..."
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
              Senha incorreta. Digite a senha correta de administrador.
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
            GERENCIADOR DE LOOKS & AUTOMAÇÕES
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <label className="y2k-btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }} title="Importar backup JSON de looks">
            <ImageIcon size={14} />
            <span>IMPORTAR BACKUP</span>
            <input 
              type="file" 
              accept=".json"
              onChange={(e) => handleImportJSON(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>

          <button onClick={handleExportJSON} className="y2k-btn-secondary" title="Baixar dados em JSON">
            <Download size={14} />
            <span>EXPORTAR BACKUP JSON</span>
          </button>

        </div>
      </div>

      {/* VPS Oracle Cloud Connection Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '20px 24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#4ade80" />
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#ffffff', margin: 0 }}>
              CONEXÃO COM SERVIDOR VPS ORACLE (BANCO DE DADOS NA NUVEM)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Status: {getVpsUrl() ? '🟢 VPS Configurada' : '🟡 Usando Servidor Padrao'}
          </span>
        </div>

        <form onSubmit={handleSaveVpsUrl} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text"
            placeholder="Ex: https://api.zapgarcom.com.br/starboy-api"
            value={vpsInputUrl}
            onChange={(e) => setVpsInputUrl(e.target.value)}
            style={{
              flex: 1,
              minWidth: '260px',
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.85rem'
            }}
          />

          <button type="submit" className="y2k-btn-secondary" style={{ fontSize: '0.8rem' }}>
            <span>SALVAR & TESTAR CONEXÃO</span>
          </button>

          {getVpsUrl() && (
            <button type="button" onClick={handleSyncAllVps} className="y2k-btn-secondary" style={{ fontSize: '0.8rem' }}>
              <span>☁️ ENVIAR LOOKS PARA VPS</span>
            </button>
          )}
        </form>

        {vpsStatus && (
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            background: vpsStatus.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : vpsStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${vpsStatus.type === 'success' ? '#4ade80' : vpsStatus.type === 'error' ? '#ef4444' : 'var(--border-light)'}`,
            color: vpsStatus.type === 'success' ? '#4ade80' : vpsStatus.type === 'error' ? '#ef4444' : '#ffffff'
          }}>
            {vpsStatus.msg}
          </div>
        )}
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
            {isEditing ? 'EDITAR LOOK EXISTENTE' : 'POSTAR NOVO LOOK (UPLOAD EM LOTE)'}
          </h2>
        </div>

        {/* BATCH UPLOAD HEADER PROMPT */}
        {!isEditing && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px dashed var(--accent-chrome)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '28px'
          }}>
            <ImageIcon size={32} color="#ffffff" style={{ margin: '0 auto 12px' }} />
            
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>
              ✦ SELECIONAR TODAS AS FOTOS DO LOOK DE UMA VEZ ✦
            </h3>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto 16px' }}>
              Selecione todas as fotos do carrossel do Instagram de uma só vez (capa + peças). A 1ª foto será definida como Capa automaticamente e você poderá alternar com 1 clique!
            </p>

            <label className="y2k-btn" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <span>SELECIONAR MÚLTIPLAS FOTOS</span>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => handleBatchImageUpload(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}

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

          {/* Cover Image Selector */}
          <div style={{
            border: '1px solid var(--border-light)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} color="#ffffff" />
                <span>FOTO DE CAPA DO LOOK (Aparece no Feed 4:5)</span>
              </label>

              {coverImage && (
                <span className="star-badge" style={{ fontSize: '0.65rem' }}>CAPA DEFINIDA ✦</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '100px', 
                minWidth: '100px',
                height: '125px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#111115',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {coverImage ? (
                  <img src={coverImage} alt="Capa Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], setCoverImage)}
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                />

                {coverImage?.startsWith('data:') && (
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', fontFamily: 'var(--font-mono)' }}>
                    ✓ Foto enviada do dispositivo
                  </div>
                )}

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OU cole a URL direta da foto de capa:</span>

                <input 
                  type="url" 
                  placeholder={coverImage?.startsWith('data:') ? '📷 Foto Carregada do Dispositivo' : 'https://...'}
                  value={coverImage?.startsWith('data:') ? '' : (coverImage || '')}
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
              <div>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#ffffff', letterSpacing: '1px' }}>
                  PEÇAS DO LOOK ({pieces.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Cole o link de compra da Shein para cada peça:
                </span>
              </div>

              <button 
                type="button" 
                onClick={addPieceRow}
                className="y2k-btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>ADICIONAR PEÇA AVULSA</span>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                        PEÇA #{index + 1}
                      </span>

                      {piece.image && (
                        <button
                          type="button"
                          onClick={() => setPhotoAsCover(index)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--border-light)',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer'
                          }}
                          title="Transformar esta foto na Foto de Capa do Look"
                        >
                          ✦ USAR ESTA FOTO COMO CAPA
                        </button>
                      )}
                    </div>

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

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                        LINK DA SHEIN (COLE O LINK DA PEÇA AQUI)
                      </label>
                      <input 
                        type="url" 
                        placeholder="https://shein.top/... ou https://www.shein.com/..."
                        value={piece.sheinUrl}
                        onChange={(e) => updatePieceField(index, 'sheinUrl', e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(15,15,20,0.8)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#ffffff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <div style={{ 
                      width: '70px', 
                      minWidth: '70px',
                      height: '88px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      background: '#111115',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {piece.image ? (
                        <img 
                          src={piece.image} 
                          alt={`Peça ${index + 1} Preview`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#666666' }}>
                          <ImageIcon size={18} />
                          <span style={{ fontSize: '0.6rem' }}>Sem foto</span>
                        </div>
                      )}
                    </div>

                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '200px' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0], (dataUrl) => updatePieceField(index, 'image', dataUrl))}
                        style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      />

                      {piece.image?.startsWith('data:') && (
                        <div style={{ fontSize: '0.7rem', color: '#22c55e', fontFamily: 'var(--font-mono)' }}>
                          ✓ Foto enviada do dispositivo
                        </div>
                      )}

                      <input 
                        type="url" 
                        placeholder={piece.image?.startsWith('data:') ? '📷 Foto Carregada do Dispositivo' : 'OU URL da Foto da Peça...'}
                        value={piece.image?.startsWith('data:') ? '' : (piece.image || '')}
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
              <span>{isEditing ? 'SALVAR ALTERAÇÕES ✦' : 'PUBLICAR LOOK COMPLETO ✦'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* NEW FEATURE: META BUSINESS AUTOMATION TEXT GENERATOR */}
      {looks.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '28px',
          marginBottom: '40px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <div className="star-badge" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>⚡ META BUSINESS & INSTAGRAM AUTOMATION</div>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '1px' }}>
                  GERADOR DE TEXTOS PARA COPIAR & COLAR
                </h2>
              </div>
            </div>

            {/* Select Target Look */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOOK:</span>
              <select
                value={selectedAutomationLookId}
                onChange={(e) => setSelectedAutomationLookId(e.target.value)}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              >
                {looks.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title || `LOOK N#${l.number}`} ({l.pieces?.length || 0} peças)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeAutomationLook && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* TEXT 1: DIRECT MESSAGE (DM) */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                    1️⃣ MENSAGEM PRIVADA NA DM (DIRECT)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta Auto-Reply DM</span>
                </div>

                <textarea
                  readOnly
                  rows={6}
                  value={getAutomationDMText(activeAutomationLook)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15,15,20,0.9)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#e2e8f0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                    resize: 'none',
                    outline: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleCopyAutomation(getAutomationDMText(activeAutomationLook), 'dm')}
                  className="y2k-btn"
                  style={{
                    fontSize: '0.8rem',
                    padding: '10px 16px',
                    background: copiedType === 'dm' ? '#22c55e' : '#ffffff',
                    borderColor: copiedType === 'dm' ? '#22c55e' : '#ffffff'
                  }}
                >
                  {copiedType === 'dm' ? (
                    <>
                      <Check size={14} color="#000000" />
                      <span>TEXTO DA DM COPIADO! ✦</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPIAR MENSAGEM DA DM</span>
                    </>
                  )}
                </button>
              </div>

              {/* TEXT 2: PUBLIC COMMENT REPLY */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
                    2️⃣ RESPOSTA NOS COMENTÁRIOS DO POST
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta Comment Reply</span>
                </div>

                <textarea
                  readOnly
                  rows={6}
                  value={getAutomationCommentText(activeAutomationLook)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15,15,20,0.9)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#e2e8f0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                    resize: 'none',
                    outline: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleCopyAutomation(getAutomationCommentText(activeAutomationLook), 'comment')}
                  className="y2k-btn"
                  style={{
                    fontSize: '0.8rem',
                    padding: '10px 16px',
                    background: copiedType === 'comment' ? '#22c55e' : '#ffffff',
                    borderColor: copiedType === 'comment' ? '#22c55e' : '#ffffff'
                  }}
                >
                  {copiedType === 'comment' ? (
                    <>
                      <Check size={14} color="#000000" />
                      <span>RESPOSTA COPIADA! ✦</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPIAR RESPOSTA DOS COMENTÁRIOS</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      )}

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ 
                  width: '46px', 
                  height: '58px', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  background: '#111', 
                  border: '1px solid var(--border-light)',
                  flexShrink: 0 
                }}>
                  <img src={look.coverImage} alt={look.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#ffffff' }}>
                    {look.title}
                  </div>
                  
                  {/* Thumbnails of Pieces */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {look.pieces?.length || 0} peças:
                    </span>
                    {look.pieces?.slice(0, 5).map((p, pIdx) => (
                      <div 
                        key={p.id || pIdx} 
                        style={{ 
                          width: '24px', 
                          height: '30px', 
                          borderRadius: '3px', 
                          overflow: 'hidden', 
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: '#222'
                        }}
                      >
                        {p.image ? (
                          <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#333' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    setSelectedAutomationLookId(look.id);
                    window.scrollTo({ top: 450, behavior: 'smooth' });
                  }} 
                  className="y2k-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  title="Gerar textos de automação para este Look"
                >
                  <Sparkles size={12} />
                  <span>GERAR TEXTOS META</span>
                </button>

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
