import { Article } from '../../../core/models/article.model';
import {
  SearchSegment,
  SearchSegmentType
} from '../models/search-segment.model';
import { normalizeSearchText } from './normalize-search-text';

const SEARCHABLE_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'li',
  'th',
  'td',
  'pre'
].join(',');

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

  let bodyIndex = 0;

  for (const element of document.body.querySelectorAll(SEARCHABLE_SELECTOR)) {
    if (!shouldCreateSegment(element)) {
      continue;
    }

    const text = getElementText(element);

    if (!text.trim()) {
      continue;
    }

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

    bodyIndex++;
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
 * Determina se l'elemento deve produrre un segmento autonomo.
 *
 * Paragrafi e heading contenuti in elementi che costituiscono già un segmento vengono assorbiti dal contenitore per evitare duplicazioni.
 */
function shouldCreateSegment(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'p' || isHeading(tagName)) {
    return !element.parentElement?.closest('li, th, td, pre');
  }

  if (tagName === 'li') {
    return !element.parentElement?.closest('pre');
  }

  if (tagName === 'th' || tagName === 'td') {
    return !element.parentElement?.closest('pre');
  }

  return tagName === 'pre';
}

/**
 * Restituisce il testo appartenente al segmento senza includere il contenuto di eventuali segmenti autonomi annidati.
 */
function getElementText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'li') {
    clone.querySelectorAll('ul, ol, pre').forEach((child) => child.remove());
  }

  if (tagName === 'th' || tagName === 'td') {
    clone.querySelectorAll('ul, ol, pre').forEach((child) => child.remove());
  }

  return clone.textContent ?? '';
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
