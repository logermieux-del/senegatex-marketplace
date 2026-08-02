/**
 * Safely parse JSON string with fallback to null
 */
export function parseJSON<T = any>(json: string | null | undefined): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Parse address JSON from database
 */
export function parseAddress(json: string | null) {
  return parseJSON(json) || {
    region: '',
    arrondissement: undefined,
    rue: undefined,
    lat: undefined,
    lng: undefined,
  };
}

/**
 * Parse location JSON from database
 */
export function parseLocation(json: string | null) {
  return parseJSON(json);
}

/**
 * Parse rating JSON from database
 */
export function parseRating(json: string | null) {
  return parseJSON(json) || {
    punctualite: 0,
    etatProduit: 0,
    communication: 0,
    professionalisme: 0,
  };
}
