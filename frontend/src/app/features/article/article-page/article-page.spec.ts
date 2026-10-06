import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  ParamMap
} from '@angular/router';
import {
  of,
  ReplaySubject,
  throwError
} from 'rxjs';
import { vi } from 'vitest';

import { Article } from '../../../core/models/article.model';
import { ContentRepositoryService } from '../../../core/data-access/content-repository.service';
import { ArticlePage } from './article-page';
import { signal } from '@angular/core';
import { SearchService } from '../../search/services/search.service';
import {
  getSearchableBodyElements
} from '../../search/utils/article-search-dom';
import {
  SearchResultGroup
} from '../../search/models/search-result.model';
import { CodePenEmbedService } from '../services/codepen-embed.service';

describe('ArticlePage', () => {
  let fixture: ComponentFixture<ArticlePage>;
  let routeParamMap: ReplaySubject<ParamMap>;
  let routeQueryParamMap: ReplaySubject<ParamMap>;

  const contentRepositoryMock = {
    getArticlesByArea: vi.fn()
  };

  const resultGroupsState =
    signal<SearchResultGroup[]>([]);

  const searchMock = {
    resultGroups:
      resultGroupsState.asReadonly()
  };

  const article: Article = {
    id: 1,
    title: 'Articolo HTML di prova',
    path: '/html/articolo-html-di-prova',
    area: 'html',
    body: '<p>Contenuto dell\'articolo.</p>',
    externalLinks: [
      {
        title: 'MDN',
        url: 'https://developer.mozilla.org'
      }
    ],
    weight: 0
  };

  const codePenEmbedMock = {
    enhance: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    routeParamMap = new ReplaySubject<ParamMap>(1);
    routeQueryParamMap = new ReplaySubject<ParamMap>(1);

    resultGroupsState.set([]);

    const emptyQueryParamMap =
      convertToParamMap({});

    await TestBed.configureTestingModule({
      imports: [ArticlePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParamMap.asObservable(),
            queryParamMap: routeQueryParamMap.asObservable(),
            snapshot: {
              queryParamMap: emptyQueryParamMap
            }
          }
        },
        {
          provide: ContentRepositoryService,
          useValue: contentRepositoryMock
        },
        {
          provide: SearchService,
          useValue: searchMock
        },
        {
          provide: CodePenEmbedService,
          useValue: codePenEmbedMock
        }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createComponent(
    area: string | null = 'html',
    slug: string | null =
      'articolo-html-di-prova',
    queryParams:
      Record<string, string> = {}
  ): void {
    const params: Record<string, string> = {};

    if (area !== null) {
      params['area'] = area;
    }

    if (slug !== null) {
      params['slug'] = slug;
    }

    routeParamMap.next(
      convertToParamMap(params)
    );

    routeQueryParamMap.next(
      convertToParamMap(queryParams)
    );


    fixture = TestBed.createComponent(ArticlePage);
    fixture.detectChanges();
  }

  it('should create', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([article])
    );

    createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra l\'articolo corrispondente alla route', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([article])
    );

    createComponent();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(
      contentRepositoryMock.getArticlesByArea
    ).toHaveBeenCalledWith('html');

    expect(
      element.querySelector('h1')?.textContent
    ).toContain('Articolo HTML di prova');

    expect(
      element.querySelector('.article-body')?.textContent
    ).toContain('Contenuto dell\'articolo.');
  });

  it('prepara gli embed CodePen dopo il rendering dell\'articolo', async () => {
    const codePenArticle: Article = {
      ...article,
      body: `
        <p>Prima del CodePen.</p>

        <div
          class="codepen-demo"
          data-prefill
        >
          <pre data-lang="html">
            &lt;button&gt;Test&lt;/button&gt;
          </pre>
        </div>
      `
    };

    contentRepositoryMock
      .getArticlesByArea
      .mockReturnValue(
        of([codePenArticle])
      );

    createComponent();

    await fixture.whenStable();

    const element: HTMLElement =
      fixture.nativeElement;

    const renderedBody =
      element.querySelector<HTMLElement>(
        '.article-body'
      );

    expect(renderedBody).toBeTruthy();

    expect(
      codePenEmbedMock.enhance
    ).toHaveBeenCalledWith(
      renderedBody,
      codePenArticle.body,
      codePenArticle.area
    );
  });

  it('mostra i link di approfondimento', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([article])
    );

    createComponent();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).toContain(
      'Approfondimenti'
    );

    const link: HTMLAnchorElement | null =
      element.querySelector('section a');

    expect(link?.textContent).toContain('MDN');

    expect(link?.href).toBe(
      'https://developer.mozilla.org/'
    );

    const newTabHint =
      link?.querySelector<HTMLElement>(
        '.visually-hidden'
      );

    expect(newTabHint).toBeTruthy();

    expect(
      newTabHint?.textContent?.trim()
    ).toBe(
      '(si apre in una nuova scheda)'
    );

    expect(link?.target).toBe('_blank');

    expect(link?.rel).toBe(
      'noopener noreferrer'
    );
  });

  it('preserva il testo ricercabile dopo il syntax highlighting', async () => {
    const codeArticle: Article = {
      ...article,
      body: `
      <pre>
        <code class="language-php">$configuration = [];</code>
      </pre>
    `
    };

    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([codeArticle])
    );

    createComponent();

    await fixture.whenStable();
    fixture.detectChanges();

    const body: HTMLElement | null =
      fixture.nativeElement.querySelector(
        '.article-body'
      );

    expect(body).toBeTruthy();

    const code = body?.querySelector<HTMLElement>(
      'code.language-php'
    );

    expect(code).toBeTruthy();

    expect(
      code?.querySelector('.token')
    ).toBeTruthy();

    expect(code?.textContent).toBe(
      '$configuration = [];'
    );

    const toolbar =
      fixture.nativeElement.querySelector(
        '.code-toolbar .toolbar'
      );

    expect(toolbar?.textContent).toContain('PHP');
    expect(toolbar?.textContent).toContain('Copia');

    expect(
      toolbar?.querySelector(
        '.copy-to-clipboard-button'
      )
    ).toBeTruthy();

    const searchableElements =
      body
        ? getSearchableBodyElements(body)
        : [];

    expect(searchableElements).toHaveLength(1);

    expect(
      searchableElements[0].textContent
    ).toContain('$configuration = [];');
  });

  it('non mostra gli approfondimenti quando non ci sono link esterni', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([
        {
          ...article,
          externalLinks: []
        }
      ])
    );

    createComponent();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).not.toContain(
      'Approfondimenti'
    );
  });

  it('mostra articolo non trovato quando il path non corrisponde', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      of([article])
    );

    createComponent(
      'html',
      'articolo-inesistente'
    );

    expect(
      fixture.nativeElement.textContent
    ).toContain('Articolo non trovato');
  });

  it('mostra articolo non trovato quando manca un parametro della route', () => {
    createComponent('html', null);

    expect(
      fixture.nativeElement.textContent
    ).toContain('Articolo non trovato');

    expect(
      contentRepositoryMock.getArticlesByArea
    ).not.toHaveBeenCalled();
  });

  it('mostra un errore quando il caricamento degli articoli fallisce', () => {
    contentRepositoryMock.getArticlesByArea.mockReturnValue(
      throwError(() => new Error('Errore API'))
    );

    createComponent();

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Impossibile caricare l\'articolo'
    );
  });

  it('sposta il focus sul segmento dell\'occorrenza selezionata', async () => {
    const searchArticle: Article = {
      ...article,
      body: '<p>Drupal utilizza i servizi.</p>'
    };

    contentRepositoryMock
      .getArticlesByArea
      .mockReturnValue(
        of([searchArticle])
      );

    resultGroupsState.set([
      {
        articleId: 1,
        articleTitle:
          'Articolo HTML di prova',
        articlePath:
          '/html/articolo-html-di-prova',
        areaId: 'html',
        occurrences: [
          {
            articleId: 1,
            segmentId:
              'article-1-segment-1',
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
              afterMatch:
                ' utilizza i servizi.',
              isStartTruncated: false,
              isEndTruncated: false
            }
          }
        ]
      }
    ]);

    const nativeCreateRange =
      document.createRange.bind(
        document
      );

    vi.spyOn(
      document,
      'createRange'
    ).mockImplementation(() => {
      const range =
        nativeCreateRange();

      Object.defineProperty(
        range,
        'getBoundingClientRect',
        {
          configurable: true,
          value: vi.fn(
            () => ({
              top: 0,
              height: 0
            } as DOMRect)
          )
        }
      );

      return range;
    });

    vi.spyOn(
      window,
      'scrollTo'
    ).mockImplementation(() => { });

    createComponent(
      'html',
      'articolo-html-di-prova',
      {
        source: 'body',
        index: '0',
        start: '0',
        end: '6'
      }
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const target =
      element.querySelector<HTMLElement>(
        '.article-body p'
      );

    expect(target).toBeTruthy();

    expect(
      document.activeElement
    ).toBe(target);

    expect(
      target?.getAttribute('tabindex')
    ).toBe('-1');
  });
});
