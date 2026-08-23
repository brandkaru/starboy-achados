// STARBOY STREETWEAR - AUTOMATIC REAL-TIME CLOUD DATABASE SERVICE
// 100% Fully Automatic: Saves & Loads directly from Cloud REST DB on any device!

const CLOUD_API_ENDPOINT = 'https://crudcrud.com/api/2943bddac47543099696bb84a1feb9ba/looks';

/**
 * Fetch all live looks from the Cloud DB
 */
export async function getCloudLooks() {
  try {
    const res = await fetch(CLOUD_API_ENDPOINT);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(item => ({
          ...item,
          id: item.id || item._id || `look-${item.number}`
        }));
      }
    }
  } catch (err) {
    console.warn('Erro ao buscar dados na nuvem:', err);
  }
  return null;
}

/**
 * Automatically push a new look to the Cloud DB
 */
export async function saveLookToCloud(look) {
  try {
    const payload = {
      number: Number(look.number),
      title: look.title,
      subtitle: look.subtitle || '',
      coverImage: look.coverImage,
      createdAt: look.createdAt || new Date().toISOString().split('T')[0],
      pieces: (look.pieces || []).map(p => ({
        id: p.id,
        title: p.title || '',
        sheinCode: p.sheinCode || '',
        sheinUrl: p.sheinUrl || '',
        image: p.image || ''
      }))
    };

    const res = await fetch(CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const savedData = await res.json();
      console.log('✦ Look salvo na nuvem com sucesso:', savedData);
      return savedData;
    }
  } catch (err) {
    console.error('Erro ao salvar na nuvem:', err);
  }
  return null;
}

/**
 * Delete a look from Cloud DB
 */
export async function deleteLookFromCloud(cloudId) {
  if (!cloudId) return;
  try {
    await fetch(`${CLOUD_API_ENDPOINT}/${cloudId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Erro ao excluir da nuvem:', err);
  }
}
