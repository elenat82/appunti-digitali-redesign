import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Area } from '../models/area.model';
import { Article } from '../models/article.model';

const DATABASE_NAME = 'appunti-digitali';
const DATABASE_VERSION = 1;

const AREAS_STORE = 'areas';
const ARTICLES_STORE = 'articles';

const AREAS_KEY = 'areas';

/**
 * Gestisce la persistenza locale delle aree e degli articoli tramite IndexedDB.
 *
 * La cache viene utilizzata esclusivamente nel browser. Durante il rendering server-side il servizio non accede a IndexedDB.
 *
 * Drupal rimane la sorgente autorevole dei dati: i contenuti memorizzati localmente costituiscono soltanto una cache persistente.
 */
@Injectable({
  providedIn: 'root',
})
export class ContentCacheService {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Recupera le aree memorizzate nella cache locale.
   */
  async getAreas(): Promise<Area[] | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const database = await this.openDatabase();

    try {
      return await this.read<Area[]>(database, AREAS_STORE, AREAS_KEY);
    }
    finally {
      database.close();
    }
  }

  /**
   * Salva l'elenco completo delle aree nella cache locale.
   */
  async setAreas(areas: Area[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const database = await this.openDatabase();

    try {
      await this.write(database, AREAS_STORE, areas, AREAS_KEY);
    }
    finally {
      database.close();
    }
  }

  /**
   * Recupera gli articoli memorizzati per una specifica area.
   */
  async getArticles(areaId: string): Promise<Article[] | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const database = await this.openDatabase();

    try {
      return await this.read<Article[]>(database, ARTICLES_STORE, areaId);
    }
    finally {
      database.close();
    }
  }

  /**
   * Salva gli articoli di una specifica area nella cache locale.
   */
  async setArticles(areaId: string, articles: Article[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const database = await this.openDatabase();

    try {
      await this.write(database, ARTICLES_STORE, articles, areaId);
    }
    finally {
      database.close();
    }
  }

  /**
   * Apre il database IndexedDB e crea gli object store necessari quando viene inizializzato o aggiornato lo schema.
   */
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(AREAS_STORE)) {
          database.createObjectStore(AREAS_STORE);
        }

        if (!database.objectStoreNames.contains(ARTICLES_STORE)) {
          database.createObjectStore(ARTICLES_STORE);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Legge un valore da uno specifico object store.
   */
  private read<T>(
    database: IDBDatabase,
    storeName: string,
    key: IDBValidKey,
  ): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve((request.result as T | undefined) ?? null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Scrive un valore in uno specifico object store.
   */
  private write(
    database: IDBDatabase,
    storeName: string,
    value: unknown,
    key: IDBValidKey,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      store.put(value, key);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };

      transaction.onabort = () => {
        reject(transaction.error);
      };
    });
  }
}
