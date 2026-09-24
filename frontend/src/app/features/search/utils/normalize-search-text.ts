/**
 * Normalizza il testo utilizzato per il confronto durante la ricerca.
 *
 * In questa prima implementazione viene normalizzato esclusivamente il case.
 * Trasformazioni che modificano lunghezza o posizione dei caratteri verranno introdotte solo insieme a una mappatura degli offset verso il testo originale.
 *
 * @param text Testo originale.
 * @returns Testo normalizzato per la ricerca.
 */
export function normalizeSearchText(text: string): string {
  return text.toLowerCase();
}
