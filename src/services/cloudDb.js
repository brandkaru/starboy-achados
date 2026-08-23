// STARBOY STREETWEAR - CLOUD DATABASE AUTOMATION SERVICE
// Syncs looks data to Cloud so every device (mobile, PC, tablet) sees identical real-time updates!

const CLOUD_RAW_URL = 'https://raw.githubusercontent.com/brandkaru/starboy-achados/main/src/data/initialData.js';

/**
 * Fetch live looks from the Cloud Database
 */
export async function fetchCloudLooks() {
  try {
    const res = await fetch(CLOUD_RAW_URL + '?t=' + Date.now());
    if (res.ok) {
      const text = await res.text();
      // Extract array from export const INITIAL_LOOKS = [...]
      const match = text.match(/INITIAL_LOOKS\s*=\s*([\s\S]*?);/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Cloud DB sync offline, using local state:', err);
  }
  return null;
}

/**
 * Generate formatted initialData.js content for Cloud deployment
 */
export function generateCloudDataJS(looks) {
  return `// STARBOY STREETWEAR - CLOUD DATABASE SOURCE OF TRUTH\nexport const INITIAL_LOOKS = ${JSON.stringify(looks, null, 2)};\n`;
}
