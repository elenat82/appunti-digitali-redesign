import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Article } from '../../../core/models/article.model';
import { SearchIndexService } from './search-index.service';

describe('SearchIndexService', () => {
  const createArticle = (
    id: number,
    title: string,
    body: string
  ): Article => ({
    id,
    title,
    path: 'drupal/',
    area: 'drupal',
    body,
    externalLinks: [],
    weight: 0
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchIndexService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    });
  });

  it('costruisce l\'indice a partire da più articoli', () => {
    const service = TestBed.inject(SearchIndexService);

    service.rebuild([
      createArticle(
        1,
        'Primo articolo',
        '<p>Primo contenuto</p>'
      ),
      createArticle(
        2,
        'Secondo articolo',
        '<h2>Secondo heading</h2>'
      )
    ]);

    expect(
      service.segments().map((segment) => ({
        articleId: segment.articleId,
        type: segment.type,
        text: segment.text.trim()
      }))
    ).toEqual([
      {
        articleId: 1,
        type: 'title',
        text: 'Primo articolo'
      },
      {
        articleId: 1,
        type: 'paragraph',
        text: 'Primo contenuto'
      },
      {
        articleId: 2,
        type: 'title',
        text: 'Secondo articolo'
      },
      {
        articleId: 2,
        type: 'heading',
        text: 'Secondo heading'
      }
    ]);

    expect(service.status()).toBe('ready');
  });

  it('sostituisce completamente l\'indice quando viene ricostruito', () => {
    const service = TestBed.inject(SearchIndexService);

    service.rebuild([
      createArticle(
        1,
        'Vecchio articolo',
        '<p>Vecchio contenuto</p>'
      )
    ]);

    service.rebuild([
      createArticle(
        2,
        'Nuovo articolo',
        '<p>Nuovo contenuto</p>'
      )
    ]);

    expect(
      service.segments().every(
        (segment) => segment.articleId === 2
      )
    ).toBe(true);

    expect(
      service.segments().some(
        (segment) => segment.articleId === 1
      )
    ).toBe(false);
  });

  it('svuota l\'indice quando il dataset è vuoto', () => {
    const service = TestBed.inject(SearchIndexService);

    service.rebuild([
      createArticle(
        1,
        'Articolo',
        '<p>Contenuto</p>'
      )
    ]);

    service.rebuild([]);

    expect(service.segments()).toEqual([]);
  });

  it('non costruisce l\'indice durante SSR', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        SearchIndexService,
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        }
      ]
    });

    const service = TestBed.inject(SearchIndexService);

    service.rebuild([
      createArticle(
        1,
        'Articolo SSR',
        '<p>Contenuto SSR</p>'
      )
    ]);

    expect(service.segments()).toEqual([]);
    expect(service.status()).toBe('preparing');
  });

  it('distingue un indice non ancora costruito da un indice vuoto ma pronto', () => {
    const service = TestBed.inject(SearchIndexService);

    expect(service.segments()).toEqual([]);
    expect(service.status()).toBe('preparing');

    service.rebuild([]);

    expect(service.segments()).toEqual([]);
    expect(service.status()).toBe('ready');
  });
});
