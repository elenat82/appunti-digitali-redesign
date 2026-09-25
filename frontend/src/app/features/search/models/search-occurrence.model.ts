/**
 * Rappresenta una singola occorrenza trovata all'interno di un segmento dell'indice di ricerca.
 */
export interface SearchOccurrence {
  /**
   * Identificativo dell'articolo che contiene l'occorrenza.
   */
  articleId: number;

  /**
   * Identificativo del segmento che contiene l'occorrenza.
   */
  segmentId: string;

  /**
   * Posizione iniziale dell'occorrenza nel testo del segmento.
   */
  startOffset: number;

  /**
   * Posizione finale esclusiva dell'occorrenza nel testo del segmento.
   */
  endOffset: number;
}
