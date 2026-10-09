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

function createVersion1Database(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      1
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      database.createObjectStore('areas');
      database.createObjectStore('articles');
    };

    request.onsuccess = () => {
      const database = request.result;

      const transaction = database.transaction(
        ['areas', 'articles'],
        'readwrite'
      );

      transaction
        .objectStore('areas')
        .put(
          [
            {
              id: 'html',
              label: 'HTML',
              iconUrl: '/html.svg',
              weight: 0
            }
          ],
          'areas'
        );

      transaction
        .objectStore('articles')
        .put(
          [
            {
              id: 1,
              title: 'Articolo legacy',
              path: '/appunti/html/articolo-legacy',
              area: 'html',
              body: '<p>Legacy</p>',
              externalLinks: [],
              weight: 0
            }
          ],
          'html'
        );

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
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
        path: 'html/html',
        area: 'html',
        body: '<p>HTML</p>',
        description: 'Descrizione SEO di prova.',
        externalLinks: [],
        weight: 0,
      },
    ];

    const cssArticles: Article[] = [
      {
        id: 2,
        title: 'CSS',
        path: 'css/css',
        area: 'css',
        body: '<p>CSS</p>',
        description: 'Descrizione SEO di prova.',
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

  it('invalida gli articoli salvati con la versione precedente del database', async () => {
    await createVersion1Database();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    });

    const service = TestBed.inject(
      ContentCacheService
    );

    expect(
      await service.getAreas()
    ).toEqual([
      {
        id: 'html',
        label: 'HTML',
        iconUrl: '/html.svg',
        weight: 0
      }
    ]);

    expect(
      await service.getArticles('html')
    ).toBeNull();
  });
});
