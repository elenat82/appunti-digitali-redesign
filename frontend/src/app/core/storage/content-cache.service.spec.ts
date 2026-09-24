import 'fake-indexeddb/auto';

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Area } from '../models/area.model';
import { Article } from '../models/article.model';
import { ContentCacheService } from './content-cache.service';

const DATABASE_NAME = 'appunti-digitali';

/**
 * Elimina il database utilizzato dai test per garantire che ogni test
 * inizi con una cache vuota.
 */
function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      reject(new Error('Impossibile eliminare il database di test.'));
    };
  });
}

describe('ContentCacheService', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    await deleteDatabase();
  });

  it('salva e recupera le aree', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    const service = TestBed.inject(ContentCacheService);

    const areas: Area[] = [
      {
        id: 'html',
        label: 'HTML',
        iconUrl: 'https://example.com/html.svg',
        weight: 0,
      },
      {
        id: 'css',
        label: 'CSS',
        iconUrl: 'https://example.com/css.svg',
        weight: 1,
      },
    ];

    await service.setAreas(areas);

    expect(await service.getAreas()).toEqual(areas);
  });

  it('restituisce null quando la cache richiesta non esiste', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    const service = TestBed.inject(ContentCacheService);

    expect(await service.getAreas()).toBeNull();
    expect(await service.getArticles('html')).toBeNull();
  });

  it('mantiene separati gli articoli delle diverse aree', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    });

    const service = TestBed.inject(ContentCacheService);

    const htmlArticles: Article[] = [
      {
        id: 1,
        title: 'HTML',
        area: 'html',
        body: '<p>HTML</p>',
        externalLinks: [],
        weight: 0,
      },
    ];

    const cssArticles: Article[] = [
      {
        id: 2,
        title: 'CSS',
        area: 'css',
        body: '<p>CSS</p>',
        externalLinks: [],
        weight: 0,
      },
    ];

    await service.setArticles('html', htmlArticles);
    await service.setArticles('css', cssArticles);

    expect(await service.getArticles('html')).toEqual(htmlArticles);
    expect(await service.getArticles('css')).toEqual(cssArticles);
  });

  it('non accede a IndexedDB durante il rendering server-side', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
      ],
    });

    const service = TestBed.inject(ContentCacheService);
    const openSpy = vi.spyOn(indexedDB, 'open');

    expect(await service.getAreas()).toBeNull();
    expect(await service.getArticles('html')).toBeNull();

    await expect(service.setAreas([])).resolves.toBeUndefined();
    await expect(service.setArticles('html', [])).resolves.toBeUndefined();

    expect(openSpy).not.toHaveBeenCalled();
  });
});
