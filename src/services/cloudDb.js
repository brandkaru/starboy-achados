// STARBOY STREETWEAR - SINGLE SOURCE OF TRUTH REAL-TIME CLOUD DATABASE SERVICE

const DEFAULT_CLOUD_URL = 'https://raw.githubusercontent.com/brandkaru/starboy-achados/main/src/data/initialData.js';

export function getVpsUrl() {
  try {
    const saved = localStorage.getItem('starboy_vps_url');
    if (saved !== null && saved !== '') return saved;
  } catch (e) {}
  
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    if (window.location.origin.includes('starboybrazil.shop')) {
      return window.location.origin;
    }
  }
  return 'https://starboybrazil.shop';
}

export function setVpsUrl(url) {
  try {
    if (!url) {
      localStorage.removeItem('starboy_vps_url');
    } else {
      let clean = url.trim();
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = 'https://' + clean;
      }
      if (clean.endsWith('/')) clean = clean.slice(0, -1);
      localStorage.setItem('starboy_vps_url', clean);
    }
  } catch (e) {
    console.error('Error saving VPS URL:', e);
  }
}

/**
 * Fetch all live looks from VPS API (Server is 100% Single Source of Truth)
 */
export async function getCloudLooks() {
  const vpsUrl = getVpsUrl();
  
  if (vpsUrl) {
    try {
      const res = await fetch(`${vpsUrl}/api/looks?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          console.log('✦ Live looks carregados da VPS Oracle em tempo real:', data.length);
          return data;
        }
      }
    } catch (err) {
      console.warn('Erro ao conectar na VPS Oracle, tentando fallback:', err);
    }
  }

  // Fallback to GitHub raw server source
  try {
    const res = await fetch(`${DEFAULT_CLOUD_URL}?t=${Date.now()}`);
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/INITIAL_LOOKS\s*=\s*([\s\S]*?);/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Erro no fallback do servidor:', err);
  }
  return null;
}

/**
 * Push new look or update to VPS Server / Cloud API
 */
export async function saveLookToCloud(look) {
  const vpsUrl = getVpsUrl();
  
  if (vpsUrl) {
    try {
      const res = await fetch(`${vpsUrl}/api/looks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(look)
      });
      if (res.ok) {
        const data = await res.json();
        console.log('✦ Look salvo com sucesso na VPS Oracle:', data);
        return data;
      }
    } catch (err) {
      console.error('Erro ao salvar na VPS Oracle:', err);
    }
  }

  return look;
}

/**
 * Delete look from VPS Server / Cloud DB
 */
export async function deleteLookFromCloud(id) {
  const vpsUrl = getVpsUrl();
  
  if (vpsUrl) {
    try {
      const res = await fetch(`${vpsUrl}/api/looks/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        console.log('✦ Look deletado com sucesso da VPS Oracle:', id);
        return true;
      }
    } catch (err) {
      console.error('Erro ao deletar da VPS Oracle:', err);
    }
  }

  return true;
}

/**
 * Bulk sync all looks to VPS Server
 */
export async function syncAllLooksToVps(looks) {
  const vpsUrl = getVpsUrl();
  if (!vpsUrl) return false;
  try {
    const res = await fetch(`${vpsUrl}/api/looks/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(looks)
    });
    return res.ok;
  } catch (err) {
    console.error('Erro ao sincronizar todos os looks na VPS Oracle:', err);
    return false;
  }
}
