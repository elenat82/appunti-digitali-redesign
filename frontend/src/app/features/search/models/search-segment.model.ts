/**
 * Tipologia del contenuto da cui deriva un segmento ricercabile.
 */
export type SearchSegmentType =
  | 'title'
  | 'heading'
  | 'paragraph'
  | 'list-item'
  | 'table-cell'
  | 'code-block'
  | 'external-link';

/**
 * Riferimento logico alla posizione del segmento all'interno dell'articolo.
 */
export interface SearchSegmentLocator {
  source: 'title' | 'body' | 'external-link';
  index?: number;
}

/**
 * Rappresenta una singola unità ricercabile appartenente a un articolo.
 */
export interface SearchSegment {
  /**
   * Identificativo del segmento all'interno del dataset corrente.
   */
  id: string;

  /**
   * Identificativo dell'articolo di appartenenza.
   */
  articleId: number;

  /**
   * Tipo di contenuto da cui deriva il segmento.
   */
  type: SearchSegmentType;

  /**
   * Posizione del segmento nell'ordine di lettura dell'articolo.
   */
  order: number;

  /**
   * Testo originale utilizzato per snippet ed evidenziazione.
   */
  text: string;

  /**
   * Testo normalizzato utilizzato durante la ricerca.
   */
  searchText: string;

  /**
   * Informazioni necessarie per ritrovare il segmento nel contenuto renderizzato.
   */
  locator: SearchSegmentLocator;
}
