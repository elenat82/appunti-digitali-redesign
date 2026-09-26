import { Article } from '../../../core/models/article.model';
import { SearchOccurrence } from '../models/search-occurrence.model';
import {
  SearchResultGroup,
  SearchResultOccurrence
} from '../models/search-result.model';
import { SearchSegment } from '../models/search-segment.model';
import { buildSearchSnippet } from './build-search-snippet';

/**
 * Raggruppa le occorrenze per articolo e genera gli snippet necessari alla presentazione dei risultati.
 *
 * L'ordine dei gruppi segue l'ordine degli articoli ricevuti.
 * L'ordine delle occorrenze all'interno di ogni gruppo rimane quello prodotto dalla ricerca.
 */
export function buildSearchResultGroups(
  articles: readonly Article[],
  segments: readonly SearchSegment[],
  occurrences: readonly SearchOccurrence[]
): SearchResultGroup[] {
  const segmentsById = new Map(
    segments.map((segment) => [segment.id, segment])
  );

  const occurrencesByArticle = new Map<
    number,
    SearchResultOccurrence[]
  >();

  for (const occurrence of occurrences) {
    const segment = segmentsById.get(occurrence.segmentId);

    if (!segment) {
      continue;
    }

    const resultOccurrence: SearchResultOccurrence = {
      ...occurrence,
      segmentType: segment.type,
      locator: segment.locator,
      snippet: buildSearchSnippet(
        segment,
        occurrence
      )
    };

    const articleOccurrences =
      occurrencesByArticle.get(occurrence.articleId) ?? [];

    articleOccurrences.push(resultOccurrence);

    occurrencesByArticle.set(
      occurrence.articleId,
      articleOccurrences
    );
  }

  return articles.flatMap((article) => {
    const articleOccurrences =
      occurrencesByArticle.get(article.id);

    if (!articleOccurrences?.length) {
      return [];
    }

    return [
      {
        articleId: article.id,
        articleTitle: article.title,
        articlePath: article.path,
        areaId: article.area,
        occurrences: articleOccurrences
      }
    ];
  });
}
