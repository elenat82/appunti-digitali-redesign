import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SearchSegment } from '../models/search-segment.model';
import {
  SearchIndexService,
  SearchIndexStatus
} from './search-index.service';
import { SearchService } from './search.service';
import { Article } from '../../../core/models/article.model';

describe('SearchService', () => {
  const segmentsState = signal<SearchSegment[]>([]);
  const statusState = signal<SearchIndexStatus>('preparing');

  const searchIndexMock = {
    segments: segmentsState.asReadonly(),
    status: statusState.asReadonly(),
    rebuild: vi.fn()
  };

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
      searchText: text.toLowerCase(),
      locator: {
        source: 'body',
        index: 0
      }
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
    segmentsState.set([]);
    statusState.set('preparing');

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        {
          provide: SearchIndexService,
          useValue: searchIndexMock
        }
      ]
    });
  });

  function createArticle(
    id: number,
    title: string,
    area: string
  ): Article {
    return {
      id,
      title,
      path: `/${area}/article-${id}`,
      area,
      body: '',
      description: 'Descrizione SEO di prova.',
      externalLinks: [],
      weight: 0
    };
  }

  // Attende più del debounce configurato (150 ms) per lasciare margine anche alla propagazione asincrona tra signal,
  // toObservable() e toSignal(), evitando test sensibili al timing dell'ambiente.
  async function waitForSearchDebounce(): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, 250)
    );
  }

  it('mantiene la query anche quando l\'indice non è ancora pronto', () => {
    const service = TestBed.inject(SearchService);

    service.setQuery('Drupal');

    expect(service.query()).toBe('Drupal');
    expect(service.occurrences()).toEqual([]);
    expect(service.indexStatus()).toBe('preparing');
  });

  it('esegue automaticamente la ricerca quando l\'indice diventa pronto', async () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    service.setQuery('Drupal');

    await vi.waitFor(() => {
      expect(
        service.isQueryPending()
      ).toBe(false);
    });

    expect(service.occurrences()).toEqual([]);

    statusState.set('ready');

    expect(service.occurrences()).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 0,
        endOffset: 6
      }
    ]);
  });

  it('aggiorna automaticamente i risultati quando cambia la query', async () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal Angular'
      )
    ]);

    statusState.set('ready');

    service.setQuery('Drupal');

    await waitForSearchDebounce();

    expect(service.occurrenceCount()).toBe(1);

    service.setQuery('Angular');

    await waitForSearchDebounce();

    expect(service.occurrences()).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 7,
        endOffset: 14
      }
    ]);
  });

  it('riesegue la ricerca quando viene aggiornato l\'indice', async () => {
    const service = TestBed.inject(SearchService);

    statusState.set('ready');

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal'
      )
    ]);

    service.setQuery('Drupal');

    await waitForSearchDebounce();

    expect(service.occurrenceCount()).toBe(1);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal'
      ),
      createSegment(
        'article-2-segment-1',
        2,
        'Drupal'
      )
    ]);

    expect(service.occurrenceCount()).toBe(2);
    expect(service.articleCount()).toBe(2);
  });

  it('calcola separatamente numero di occorrenze e numero di articoli', async () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal Drupal'
      ),
      createSegment(
        'article-2-segment-1',
        2,
        'Drupal'
      )
    ]);

    statusState.set('ready');
    service.setQuery('Drupal');

    await waitForSearchDebounce();

    expect(service.occurrenceCount()).toBe(3);
    expect(service.articleCount()).toBe(2);
    expect(service.articleIds()).toEqual([1, 2]);
  });

  it('non esegue una ricerca per una query composta solo da spazi', () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    statusState.set('ready');
    service.setQuery('   ');

    expect(service.query()).toBe('   ');
    expect(service.occurrences()).toEqual([]);
  });

  it('aggiorna gli articoli e richiede la ricostruzione dell\'indice', () => {
    const service = TestBed.inject(SearchService);

    const articles = [
      createArticle(
        1,
        'Articolo Drupal',
        'drupal'
      )
    ];

    service.updateArticles(articles);

    expect(
      searchIndexMock.rebuild
    ).toHaveBeenCalledWith(articles);
  });

  it('costruisce i risultati raggruppati per articolo', async () => {
    const service = TestBed.inject(SearchService);

    service.updateArticles([
      createArticle(
        1,
        'Articolo Drupal',
        'drupal'
      )
    ]);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    statusState.set('ready');

    service.setQuery('Drupal');

    await waitForSearchDebounce();

    const groups = service.resultGroups();

    expect(groups).toHaveLength(1);

    expect(groups[0].articleId).toBe(1);
    expect(groups[0].articleTitle).toBe(
      'Articolo Drupal'
    );
    expect(groups[0].areaId).toBe('drupal');
    expect(groups[0].occurrences).toHaveLength(1);

    expect(
      groups[0].occurrences[0].segmentType
    ).toBe('paragraph');

    expect(
      groups[0].occurrences[0].snippet.match
    ).toBe('Drupal');
  });

  it('non apre né esegue la ricerca sotto i tre caratteri', async () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    statusState.set('ready');

    service.setQuery('Dr');

    await waitForSearchDebounce();

    expect(service.query()).toBe('Dr');
    expect(service.isResultsOpen()).toBe(false);
    expect(service.occurrences()).toEqual([]);
  });

  it('avvia la ricerca da tre caratteri', async () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    statusState.set('ready');

    service.setQuery('Dru');

    expect(service.isResultsOpen()).toBe(true);
    expect(service.occurrences()).toEqual([]);

    await waitForSearchDebounce();

    expect(service.occurrenceCount()).toBe(1);
  });
});
