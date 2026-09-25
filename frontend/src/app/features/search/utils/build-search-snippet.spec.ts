import { SearchOccurrence } from '../models/search-occurrence.model';
import { SearchSegment } from '../models/search-segment.model';
import { buildSearchSnippet } from './build-search-snippet';

describe('buildSearchSnippet', () => {
  function createSegment(
    text: string,
    type: SearchSegment['type'] = 'paragraph'
  ): SearchSegment {
    return {
      id: 'article-1-segment-1',
      articleId: 1,
      type,
      order: 0,
      text,
      searchText: text.toLowerCase(),
      locator: {
        source: 'body',
        index: 0
      }
    };
  }

  function createOccurrence(
    startOffset: number,
    endOffset: number
  ): SearchOccurrence {
    return {
      articleId: 1,
      segmentId: 'article-1-segment-1',
      startOffset,
      endOffset
    };
  }

  it('restituisce l\'intero segmento quando è più corto del contesto', () => {
    const segment = createSegment(
      'Drupal utilizza i servizi.'
    );

    const snippet = buildSearchSnippet(
      segment,
      createOccurrence(0, 6)
    );

    expect(snippet).toEqual({
      beforeMatch: '',
      match: 'Drupal',
      afterMatch: ' utilizza i servizi.',
      isStartTruncated: false,
      isEndTruncated: false
    });
  });

  it('limita il contesto prima e dopo il match', () => {
    const segment = createSegment(
      'abcdefghijDRUPALklmnopqrst'
    );

    const snippet = buildSearchSnippet(
      segment,
      createOccurrence(10, 16),
      5
    );

    expect(snippet).toEqual({
      beforeMatch: 'fghij',
      match: 'DRUPAL',
      afterMatch: 'klmno',
      isStartTruncated: true,
      isEndTruncated: true
    });
  });

  it('mantiene il testo tecnico originale', () => {
    const segment = createSegment(
      '$queue = $this->queueFactory->get("example");'
    );

    const snippet = buildSearchSnippet(
      segment,
      createOccurrence(9, 14),
      10
    );

    expect(snippet.match).toBe('$this');
  });

  it('usa le righe circostanti per un blocco di codice', () => {
    const text = [
      '$first = true;',
      '$queue = $this->queueFactory->get("example");',
      '$queue->createItem($data);',
      '$last = true;'
    ].join('\n');

    const segment = createSegment(
      text,
      'code-block'
    );

    const startOffset = text.indexOf('$this');

    const snippet = buildSearchSnippet(
      segment,
      createOccurrence(
        startOffset,
        startOffset + 5
      )
    );

    expect(
      `${snippet.beforeMatch}${snippet.match}${snippet.afterMatch}`
    ).toBe(
      [
        '$first = true;',
        '$queue = $this->queueFactory->get("example");',
        '$queue->createItem($data);'
      ].join('\n')
    );

    expect(snippet.match).toBe('$this');
    expect(snippet.isStartTruncated).toBe(false);
    expect(snippet.isEndTruncated).toBe(true);
  });

  it('tronca il codice sui confini delle righe', () => {
    const text = [
      'line 1',
      'line 2',
      '$value = $this->service;',
      'line 4',
      'line 5'
    ].join('\n');

    const segment = createSegment(
      text,
      'code-block'
    );

    const startOffset = text.indexOf('$this');

    const snippet = buildSearchSnippet(
      segment,
      createOccurrence(
        startOffset,
        startOffset + 5
      )
    );

    expect(
      `${snippet.beforeMatch}${snippet.match}${snippet.afterMatch}`
    ).toBe(
      [
        'line 2',
        '$value = $this->service;',
        'line 4'
      ].join('\n')
    );

    expect(snippet.isStartTruncated).toBe(true);
    expect(snippet.isEndTruncated).toBe(true);
  });
});
