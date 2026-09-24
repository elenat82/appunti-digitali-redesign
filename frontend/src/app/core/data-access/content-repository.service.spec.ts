import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError, toArray } from 'rxjs';
import { vi } from 'vitest';

import { PLATFORM_ID } from '@angular/core';

import { Area } from '../models/area.model';
import { Article } from '../models/article.model';
import { ContentCacheService } from '../storage/content-cache.service';
import { AreasService } from '../../features/areas/data-access/areas.service';
import { ArticlesService } from '../../features/articles/data-access/articles.service';
import { ContentRepositoryService } from './content-repository.service';

describe('ContentRepositoryService', () => {
  const areasServiceMock = {
    getAreas: vi.fn()
  };

  const articlesServiceMock = {
    getByArea: vi.fn()
  };

  const contentCacheMock = {
    getAreas: vi.fn(),
    setAreas: vi.fn(),
    getArticles: vi.fn(),
    setArticles: vi.fn()
  };

  const cachedAreas: Area[] = [
    {
      id: 'html',
      label: 'HTML cached',
      iconUrl: '/html.svg',
      weight: 0
    }
  ];

  const remoteAreas: Area[] = [
    {
      id: 'html',
      label: 'HTML',
      iconUrl: '/html.svg',
      weight: 0
    }
  ];

  const cachedArticles: Article[] = [
    {
      id: 1,
      title: 'HTML cached',
      area: 'html',
      body: '<p>Cached</p>',
      externalLinks: [],
      weight: 0
    }
  ];

  const remoteArticles: Article[] = [
    {
      id: 1,
      title: 'HTML',
      area: 'html',
      body: '<p>Remote</p>',
      externalLinks: [],
      weight: 0
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    contentCacheMock.setAreas.mockResolvedValue(undefined);
    contentCacheMock.setArticles.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        ContentRepositoryService,
        {
          provide: AreasService,
          useValue: areasServiceMock
        },
        {
          provide: ArticlesService,
          useValue: articlesServiceMock
        },
        {
          provide: ContentCacheService,
          useValue: contentCacheMock
        }
      ]
    });
  });

  it('emette prima le aree in cache e poi quelle recuperate dal backend', async () => {
    contentCacheMock.getAreas.mockResolvedValue(cachedAreas);
    areasServiceMock.getAreas.mockReturnValue(of(remoteAreas));

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getAreas().pipe(toArray())
    );

    expect(result).toEqual([
      cachedAreas,
      remoteAreas
    ]);

    expect(contentCacheMock.setAreas).toHaveBeenCalledWith(remoteAreas);
  });

  it('recupera le aree dal backend quando la cache locale è assente', async () => {
    contentCacheMock.getAreas.mockResolvedValue(null);
    areasServiceMock.getAreas.mockReturnValue(of(remoteAreas));

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getAreas().pipe(toArray())
    );

    expect(result).toEqual([remoteAreas]);
  });

  it('mantiene le aree in cache quando il backend non è disponibile', async () => {
    contentCacheMock.getAreas.mockResolvedValue(cachedAreas);
    areasServiceMock.getAreas.mockReturnValue(
      throwError(() => new Error('API unavailable'))
    );

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getAreas().pipe(toArray())
    );

    expect(result).toEqual([cachedAreas]);
  });

  it('continua a utilizzare il backend se IndexedDB non è disponibile', async () => {
    contentCacheMock.getAreas.mockRejectedValue(
      new Error('IndexedDB unavailable')
    );
    areasServiceMock.getAreas.mockReturnValue(of(remoteAreas));

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getAreas().pipe(toArray())
    );

    expect(result).toEqual([remoteAreas]);
  });

  it('emette prima gli articoli in cache e poi quelli recuperati dal backend', async () => {
    contentCacheMock.getArticles.mockResolvedValue(cachedArticles);
    articlesServiceMock.getByArea.mockReturnValue(of(remoteArticles));

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getArticlesByArea('html').pipe(toArray())
    );

    expect(result).toEqual([
      cachedArticles,
      remoteArticles
    ]);

    expect(contentCacheMock.getArticles).toHaveBeenCalledWith('html');
    expect(articlesServiceMock.getByArea).toHaveBeenCalledWith('html');
    expect(contentCacheMock.setArticles).toHaveBeenCalledWith(
      'html',
      remoteArticles
    );
  });

  it('mantiene gli articoli in cache quando la richiesta dell’area fallisce', async () => {
    contentCacheMock.getArticles.mockResolvedValue(cachedArticles);
    articlesServiceMock.getByArea.mockReturnValue(
      throwError(() => new Error('API unavailable'))
    );

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getArticlesByArea('html').pipe(toArray())
    );

    expect(result).toEqual([cachedArticles]);
  });

  it('restituisce una lista vuota durante SSR se Drupal non è disponibile', async () => {
    TestBed.resetTestingModule();

    contentCacheMock.getAreas.mockResolvedValue(null);
    areasServiceMock.getAreas.mockReturnValue(
      throwError(() => new Error('API unavailable'))
    );

    TestBed.configureTestingModule({
      providers: [
        ContentRepositoryService,
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        },
        {
          provide: AreasService,
          useValue: areasServiceMock
        },
        {
          provide: ArticlesService,
          useValue: articlesServiceMock
        },
        {
          provide: ContentCacheService,
          useValue: contentCacheMock
        }
      ]
    });

    const service = TestBed.inject(ContentRepositoryService);

    const result = await firstValueFrom(
      service.getAreas().pipe(toArray())
    );

    expect(result).toEqual([[]]);
  });
});
