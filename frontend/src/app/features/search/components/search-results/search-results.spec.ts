import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { SearchService } from '../../services/search.service';
import { SearchResults } from './search-results';
import { SearchResultGroup } from '../../models/search-result.model';

describe('SearchResults', () => {
  let fixture: ComponentFixture<SearchResults>;

  const queryState = signal('');
  const indexStatusState =
    signal<'preparing' | 'ready'>('preparing');
  const occurrenceCountState = signal(0);
  const articleCountState = signal(0);
  const resultGroupsState = signal<SearchResultGroup[]>([]);

  const searchMock = {
    query: queryState.asReadonly(),
    indexStatus: indexStatusState.asReadonly(),
    occurrenceCount:
      occurrenceCountState.asReadonly(),
    articleCount:
      articleCountState.asReadonly(),
    resultGroups:
      resultGroupsState.asReadonly()
  };

  beforeEach(async () => {
    queryState.set('');
    indexStatusState.set('preparing');
    occurrenceCountState.set(0);
    articleCountState.set(0);
    resultGroupsState.set([]);

    await TestBed.configureTestingModule({
      imports: [SearchResults],
      providers: [
        provideRouter([]),
        {
          provide: SearchService,
          useValue: searchMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResults);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('non mostra risultati quando la query è vuota', () => {
    expect(
      fixture.nativeElement.textContent.trim()
    ).toBe('');
  });

  it('mostra lo stato di preparazione', () => {
    queryState.set('Drupal');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain('Preparazione della ricerca');
  });

  it('mostra lo stato senza risultati', () => {
    queryState.set('Drupal');
    indexStatusState.set('ready');

    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain('Nessun risultato per');
  });

  it('mostra il numero di occorrenze e articoli', () => {
    queryState.set('Drupal');
    indexStatusState.set('ready');
    occurrenceCountState.set(12);
    articleCountState.set(3);

    fixture.detectChanges();

    const text =
      fixture.nativeElement.textContent;

    expect(text).toContain('12 occorrenze');
    expect(text).toContain('3 articoli');
  });

  it('mostra i risultati raggruppati per articolo', () => {
    queryState.set('Drupal');
    indexStatusState.set('ready');
    occurrenceCountState.set(1);
    articleCountState.set(1);

    resultGroupsState.set([
      {
        articleId: 1,
        articleTitle: 'Articolo Drupal',
        articlePath: '/drupal/articolo-drupal',
        areaId: 'drupal',
        occurrences: [
          {
            articleId: 1,
            segmentId: 'article-1-segment-1',
            startOffset: 0,
            endOffset: 6,
            segmentType: 'paragraph',
            locator: {
              source: 'body',
              index: 0
            },
            snippet: {
              beforeMatch: '',
              match: 'Drupal',
              afterMatch: ' utilizza i servizi.',
              isStartTruncated: false,
              isEndTruncated: false
            }
          }
        ]
      }
    ]);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).toContain(
      'Articolo Drupal'
    );

    expect(element.textContent).toContain(
      'Drupal utilizza i servizi.'
    );

    expect(
      element.querySelector('mark')?.textContent
    ).toBe('Drupal');
  });

  it('preserva il tipo dei risultati di codice', () => {
    queryState.set('$this');
    indexStatusState.set('ready');
    occurrenceCountState.set(1);
    articleCountState.set(1);

    resultGroupsState.set([
      {
        articleId: 1,
        articleTitle: 'Articolo Drupal',
        articlePath: '/drupal/articolo-drupal',
        areaId: 'drupal',
        occurrences: [
          {
            articleId: 1,
            segmentId: 'article-1-segment-1',
            startOffset: 9,
            endOffset: 14,
            segmentType: 'code-block',
            locator: {
              source: 'body',
              index: 0
            },
            snippet: {
              beforeMatch: '$queue = ',
              match: '$this',
              afterMatch:
                '->queueFactory->get("example");',
              isStartTruncated: true,
              isEndTruncated: true
            }
          }
        ]
      }
    ]);

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(
        '.search-result-code'
      )
    ).toBeTruthy();
  });

  it('collega ogni occorrenza all\'articolo corrispondente', () => {
    queryState.set('Drupal');
    indexStatusState.set('ready');
    occurrenceCountState.set(1);
    articleCountState.set(1);

    resultGroupsState.set([
      {
        articleId: 1,
        articleTitle: 'Articolo Drupal',
        articlePath: '/drupal/articolo-drupal',
        areaId: 'drupal',
        occurrences: [
          {
            articleId: 1,
            segmentId: 'article-1-segment-1',
            startOffset: 0,
            endOffset: 6,
            segmentType: 'paragraph',
            locator: {
              source: 'body',
              index: 0
            },
            snippet: {
              beforeMatch: '',
              match: 'Drupal',
              afterMatch: ' utilizza i servizi.',
              isStartTruncated: false,
              isEndTruncated: false
            }
          }
        ]
      }
    ]);

    fixture.detectChanges();

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector(
        '.search-result-link'
      );

    expect(link.getAttribute('href')).toBe(
      '/drupal/articolo-drupal?source=body&index=0&start=0&end=6'
    );
  });
});
