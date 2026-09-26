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
 * Restituisce gli elementi del body che generano un SearchSegment.
 */
export function getSearchableBodyElements(
  root: ParentNode
): Element[] {
  return Array.from(
    root.querySelectorAll(SEARCHABLE_SELECTOR)
  ).filter(
    (element) =>
      shouldCreateSegment(element) &&
      getSearchableElementText(element).trim()
  );
}

/**
 * Restituisce il testo appartenente al segmento senza includere il contenuto di eventuali segmenti autonomi annidati.
 */
export function getSearchableElementText(
  element: Element
): string {
  const clone = element.cloneNode(true) as Element;
  const tagName = element.tagName.toLowerCase();

  if (
    tagName === 'li' ||
    tagName === 'th' ||
    tagName === 'td'
  ) {
    clone
      .querySelectorAll('ul, ol, pre')
      .forEach((child) => child.remove());
  }

  return clone.textContent ?? '';
}

function shouldCreateSegment(
  element: Element
): boolean {
  const tagName = element.tagName.toLowerCase();

  if (
    tagName === 'p' ||
    isHeading(tagName)
  ) {
    return !element.parentElement?.closest(
      'li, th, td, pre'
    );
  }

  if (
    tagName === 'li' ||
    tagName === 'th' ||
    tagName === 'td'
  ) {
    return !element.parentElement?.closest('pre');
  }

  return tagName === 'pre';
}

function isHeading(tagName: string): boolean {
  return /^h[1-6]$/.test(tagName);
}
