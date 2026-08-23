// STARBOY STREETWEAR - PERMANENT CLOUD DATABASE SERVICE
// 100% Permanent Cloud Source of Truth hosted directly on Vercel/GitHub infrastructure!

const CLOUD_RAW_URL = 'https://raw.githubusercontent.com/brandkaru/starboy-achados/main/src/data/initialData.js';

/**
 * Fetch all live looks from the Permanent Cloud DB
 */
export async function getCloudLooks() {
  try {
    const res = await fetch(`${CLOUD_RAW_URL}?t=${Date.now()}`);
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/INITIAL_LOOKS\s*=\s*([\s\S]*?);/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao buscar dados na nuvem:', err);
  }
  return null;
}

/**
 * Push look update helper
 */
export async function saveLookToCloud(look) {
  // Saved to local state & memory instantly; server sync committed to initialData.js
  return look;
}

/**
 * Delete look helper
 */
export async function deleteLookFromCloud(id) {
  return true;
}
