import { SearchSegment } from '../models/search-segment.model';
import { findSearchOccurrences } from './find-search-occurrences';
import { normalizeSearchText } from './normalize-search-text';

describe('findSearchOccurrences', () => {
  function createSegment(
    id: string,
    articleId: number,
    text: string
  ): SearchSegment {
    return {
      id,
      articleId,
      type: 'paragraph',
      order: 0,
      text,
      searchText: normalizeSearchText(text),
      locator: {
        source: 'body',
        index: 0
      }
    };
  }

  it('trova tutte le occorrenze presenti nello stesso segmento', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'Drupal usa Drupal e Drupal core.'
    );

    const occurrences = findSearchOccurrences(
      [segment],
      'Drupal'
    );

    expect(occurrences).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 0,
        endOffset: 6
      },
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 11,
        endOffset: 17
      },
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 20,
        endOffset: 26
      }
    ]);
  });

  it('esegue la ricerca senza distinguere maiuscole e minuscole', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'Drupal DRUPAL drupal'
    );

    const occurrences = findSearchOccurrences(
      [segment],
      'dRuPaL'
    );

    expect(occurrences).toHaveLength(3);
  });

  it('trova corrispondenze all\'interno di parole più lunghe', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'extends'
    );

    const occurrences = findSearchOccurrences(
      [segment],
      'tend'
    );

    expect(occurrences).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 2,
        endOffset: 6
      }
    ]);
  });

  it('ricerca correttamente frammenti tecnici', () => {
    const segments = [
      createSegment(
        'article-1-segment-1',
        1,
        'nome_modulo.info.yml'
      ),
      createSegment(
        'article-1-segment-2',
        1,
        '$value => $result'
      ),
      createSegment(
        'article-2-segment-1',
        2,
        '@Input()'
      ),
      createSegment(
        'article-2-segment-2',
        2,
        '::before'
      )
    ];

    expect(
      findSearchOccurrences(segments, '.info.yml')
    ).toHaveLength(1);

    expect(
      findSearchOccurrences(segments, '=>')
    ).toHaveLength(1);

    expect(
      findSearchOccurrences(segments, '@Input')
    ).toHaveLength(1);

    expect(
      findSearchOccurrences(segments, '::before')
    ).toHaveLength(1);
  });

  it('trova occorrenze appartenenti a segmenti e articoli diversi', () => {
    const segments = [
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      ),
      createSegment(
        'article-2-segment-3',
        2,
        'Drupal module'
      )
    ];

    const occurrences = findSearchOccurrences(
      segments,
      'Drupal'
    );

    expect(occurrences).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 0,
        endOffset: 6
      },
      {
        articleId: 2,
        segmentId: 'article-2-segment-3',
        startOffset: 0,
        endOffset: 6
      }
    ]);
  });

  it('restituisce un array vuoto quando la query non è presente', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'Drupal'
    );

    expect(
      findSearchOccurrences([segment], 'Angular')
    ).toEqual([]);
  });

  it('restituisce un array vuoto per una query vuota', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'Drupal'
    );

    expect(
      findSearchOccurrences([segment], '')
    ).toEqual([]);
  });

  it('trova anche le occorrenze sovrapposte', () => {
    const segment = createSegment(
      'article-1-segment-1',
      1,
      'aaaa'
    );

    const occurrences = findSearchOccurrences(
      [segment],
      'aa'
    );

    expect(occurrences).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 0,
        endOffset: 2
      },
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 1,
        endOffset: 3
      },
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 2,
        endOffset: 4
      }
    ]);
  });
});
