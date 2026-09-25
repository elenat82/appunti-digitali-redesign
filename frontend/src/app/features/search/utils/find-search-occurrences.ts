import { SearchOccurrence } from '../models/search-occurrence.model';
import { SearchSegment } from '../models/search-segment.model';
import { normalizeSearchText } from './normalize-search-text';

/**
 * Cerca tutte le occorrenze di una query nei segmenti dell'indice.
 *
 * La ricerca viene eseguita per sottostringa sul testo normalizzato, mantenendo gli offset necessari per individuare il match nel segmento.
 *
 * @param segments Segmenti che compongono l'indice di ricerca.
 * @param query Query inserita dall'utente.
 * @returns Tutte le occorrenze trovate nell'ordine dell'indice.
 */
export function findSearchOccurrences(
  segments: SearchSegment[],
  query: string
): SearchOccurrence[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const occurrences: SearchOccurrence[] = [];

  for (const segment of segments) {
    let searchFrom = 0;

    while (searchFrom <= segment.searchText.length - normalizedQuery.length) {
      const startOffset = segment.searchText.indexOf(
        normalizedQuery,
        searchFrom
      );

      if (startOffset === -1) {
        break;
      }

      occurrences.push({
        articleId: segment.articleId,
        segmentId: segment.id,
        startOffset,
        endOffset: startOffset + normalizedQuery.length
      });

      searchFrom = startOffset + 1;
    }
  }

  return occurrences;
}
