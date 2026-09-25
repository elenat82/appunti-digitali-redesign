import { SearchOccurrence } from '../models/search-occurrence.model';
import { SearchSnippet } from '../models/search-result.model';
import { SearchSegment } from '../models/search-segment.model';

const DEFAULT_CONTEXT_LENGTH = 60;

/**
 * Genera lo snippet visualizzato per una singola occorrenza.
 *
 * I contenuti testuali utilizzano un contesto basato sul numero di caratteri. I blocchi di codice utilizzano invece le righe circostanti, così da preservare una porzione di codice leggibile.
 *
 * @param segment Segmento che contiene l'occorrenza.
 * @param occurrence Occorrenza per cui generare lo snippet.
 * @param contextLength Numero massimo di caratteri mostrati
 *   prima e dopo la corrispondenza nei segmenti testuali.
 */
export function buildSearchSnippet(
  segment: SearchSegment,
  occurrence: SearchOccurrence,
  contextLength = DEFAULT_CONTEXT_LENGTH
): SearchSnippet {
  if (segment.type === 'code-block') {
    return buildCodeSnippet(segment, occurrence);
  }

  return buildTextSnippet(
    segment,
    occurrence,
    contextLength
  );
}

function buildTextSnippet(
  segment: SearchSegment,
  occurrence: SearchOccurrence,
  contextLength: number
): SearchSnippet {
  const snippetStart = Math.max(
    0,
    occurrence.startOffset - contextLength
  );

  const snippetEnd = Math.min(
    segment.text.length,
    occurrence.endOffset + contextLength
  );

  return buildSnippet(
    segment.text,
    occurrence,
    snippetStart,
    snippetEnd
  );
}

function buildCodeSnippet(
  segment: SearchSegment,
  occurrence: SearchOccurrence
): SearchSnippet {
  const text = segment.text;

  const currentLineStart =
    text.lastIndexOf('\n', occurrence.startOffset - 1) + 1;

  const currentLineEndIndex = text.indexOf(
    '\n',
    occurrence.endOffset
  );

  const currentLineEnd =
    currentLineEndIndex === -1
      ? text.length
      : currentLineEndIndex;

  const previousLineStart =
    currentLineStart === 0
      ? 0
      : text.lastIndexOf(
        '\n',
        currentLineStart - 2
      ) + 1;

  const nextLineEndIndex =
    currentLineEnd === text.length
      ? -1
      : text.indexOf('\n', currentLineEnd + 1);

  const nextLineEnd =
    nextLineEndIndex === -1
      ? text.length
      : nextLineEndIndex;

  return buildSnippet(
    text,
    occurrence,
    previousLineStart,
    nextLineEnd
  );
}

function buildSnippet(
  text: string,
  occurrence: SearchOccurrence,
  snippetStart: number,
  snippetEnd: number
): SearchSnippet {
  return {
    beforeMatch: text.slice(
      snippetStart,
      occurrence.startOffset
    ),
    match: text.slice(
      occurrence.startOffset,
      occurrence.endOffset
    ),
    afterMatch: text.slice(
      occurrence.endOffset,
      snippetEnd
    ),
    isStartTruncated: snippetStart > 0,
    isEndTruncated: snippetEnd < text.length
  };
}
