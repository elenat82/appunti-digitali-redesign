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

describe('ArticlePage', () => {
  let fixture: ComponentFixture<ArticlePage>;
  let routeParamMap: ReplaySubject<ParamMap>;

  const contentRepositoryMock = {
    getArticlesByArea: vi.fn()
  };

  const searchMock = {
    resultGroups: signal([])
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

  beforeEach(async () => {
    vi.clearAllMocks();

    routeParamMap = new ReplaySubject<ParamMap>(1);

    const emptyQueryParamMap =
      convertToParamMap({});

    await TestBed.configureTestingModule({
      imports: [ArticlePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParamMap.asObservable(),
            queryParamMap: of(emptyQueryParamMap),
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
        }
      ]
    }).compileComponents();
  });

  function createComponent(
    area: string | null = 'html',
    slug: string | null = 'articolo-html-di-prova'
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
});
