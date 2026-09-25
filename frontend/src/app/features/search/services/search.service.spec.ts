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
      externalLinks: [],
      weight: 0
    };
  }

  it('mantiene la query anche quando l\'indice non è ancora pronto', () => {
    const service = TestBed.inject(SearchService);

    service.setQuery('Drupal');

    expect(service.query()).toBe('Drupal');
    expect(service.occurrences()).toEqual([]);
    expect(service.indexStatus()).toBe('preparing');
  });

  it('esegue automaticamente la ricerca quando l\'indice diventa pronto', () => {
    const service = TestBed.inject(SearchService);

    segmentsState.set([
      createSegment(
        'article-1-segment-1',
        1,
        'Drupal service'
      )
    ]);

    service.setQuery('Drupal');

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

  it('aggiorna automaticamente i risultati quando cambia la query', () => {
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

    expect(service.occurrenceCount()).toBe(1);

    service.setQuery('Angular');

    expect(service.occurrences()).toEqual([
      {
        articleId: 1,
        segmentId: 'article-1-segment-1',
        startOffset: 7,
        endOffset: 14
      }
    ]);
  });

  it('riesegue la ricerca quando viene aggiornato l\'indice', () => {
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

  it('calcola separatamente numero di occorrenze e numero di articoli', () => {
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

  it('aggiorna gli articoli e richiede la ricostruzione dell’indice', () => {
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

  it('costruisce i risultati raggruppati per articolo', () => {
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
});
