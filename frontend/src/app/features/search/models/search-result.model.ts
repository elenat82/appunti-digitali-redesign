import { SearchOccurrence } from './search-occurrence.model';
import {
  SearchSegmentLocator,
  SearchSegmentType
} from './search-segment.model';

/**
 * Contenuto testuale mostrato per una singola occorrenza nei risultati di ricerca.
 */
export interface SearchSnippet {
  /**
   * Testo visualizzato prima della corrispondenza.
   */
  beforeMatch: string;

  /**
   * Testo originale corrispondente alla query.
   */
  match: string;

  /**
   * Testo visualizzato dopo la corrispondenza.
   */
  afterMatch: string;

  /**
   * Indica che lo snippet non inizia dall'inizio del segmento.
   */
  isStartTruncated: boolean;

  /**
   * Indica che lo snippet non termina alla fine del segmento.
   */
  isEndTruncated: boolean;
}

/**
 * Occorrenza pronta per essere presentata nei risultati di ricerca.
 */
export interface SearchResultOccurrence extends SearchOccurrence {
  segmentType: SearchSegmentType;
  locator: SearchSegmentLocator;
  snippet: SearchSnippet;
}

/**
 * Risultati appartenenti a uno stesso articolo.
 */
export interface SearchResultGroup {
  articleId: number;
  articleTitle: string;
  articlePath: string;
  areaId: string;
  occurrences: SearchResultOccurrence[];
}
