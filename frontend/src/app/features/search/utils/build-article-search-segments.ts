import { Article } from '../../../core/models/article.model';
import {
  SearchSegment,
  SearchSegmentType
} from '../models/search-segment.model';
import { normalizeSearchText } from './normalize-search-text';
import {
  getSearchableBodyElements,
  getSearchableElementText
} from './article-search-dom';

/**
 * Costruisce i segmenti ricercabili derivati dal titolo e dal body di un articolo.
 *
 * Il contenuto degli external link viene aggiunto separatamente.
 *
 * @param article Articolo da segmentare.
 * @returns Segmenti ricercabili nell'ordine di lettura.
 */
export function buildArticleSearchSegments(
  article: Article
): SearchSegment[] {
  const segments: SearchSegment[] = [
    createSegment(
      article,
      'title',
      0,
      article.title,
      {
        source: 'title'
      }
    )
  ];

  const parser = new DOMParser();
  const document = parser.parseFromString(article.body, 'text/html');

  const bodyElements =
    getSearchableBodyElements(document.body);

  for (const [bodyIndex, element] of bodyElements.entries()) {
    const text =
      getSearchableElementText(element);

    segments.push(
      createSegment(
        article,
        getSegmentType(element),
        segments.length,
        text,
        {
          source: 'body',
          index: bodyIndex
        }
      )
    );
  }

  article.externalLinks.forEach((link, index) => {
    const text = link.title.trim()
      ? `${link.title}\n${link.url}`
      : link.url;

    if (!text.trim()) {
      return;
    }

    segments.push(
      createSegment(
        article,
        'external-link',
        segments.length,
        text,
        {
          source: 'external-link',
          index
        }
      )
    );
  });

  return segments;
}

/**
 * Crea un SearchSegment mantenendo separati testo originale e testo normalizzato.
 */
function createSegment(
  article: Article,
  type: SearchSegmentType,
  order: number,
  text: string,
  locator: SearchSegment['locator']
): SearchSegment {
  return {
    id: `article-${article.id}-segment-${order}`,
    articleId: article.id,
    type,
    order,
    text,
    searchText: normalizeSearchText(text),
    locator
  };
}

/**
 * Restituisce il tipo di SearchSegment associato all'elemento HTML.
 */
function getSegmentType(element: Element): SearchSegmentType {
  const tagName = element.tagName.toLowerCase();

  if (isHeading(tagName)) {
    return 'heading';
  }

  switch (tagName) {
    case 'p':
      return 'paragraph';

    case 'li':
      return 'list-item';

    case 'th':
    case 'td':
      return 'table-cell';

    case 'pre':
      return 'code-block';

    default:
      throw new Error(`Unsupported searchable element: ${tagName}`);
  }
}

/**
 * Verifica se il tag rappresenta un heading HTML.
 */
function isHeading(tagName: string): boolean {
  return /^h[1-6]$/.test(tagName);
}
