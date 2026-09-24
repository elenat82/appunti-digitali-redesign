import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { Article } from '../../../core/models/article.model';
import { SearchSegment } from '../models/search-segment.model';
import { buildArticleSearchSegments } from '../utils/build-article-search-segments';

export type SearchIndexStatus = 'preparing' | 'ready';

/**
 * Gestisce l'indice di ricerca locale costruito a partire dagli articoli.
 *
 * L'indice viene mantenuto esclusivamente in memoria e viene ricostruito quando cambia il dataset degli articoli.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchIndexService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly segmentsState = signal<SearchSegment[]>([]);

  private readonly statusState = signal<SearchIndexStatus>('preparing');

  /**
   * Stato corrente di preparazione dell'indice.
   */
  readonly status = this.statusState.asReadonly();

  /**
   * Segmenti attualmente presenti nell'indice.
   */
  readonly segments = this.segmentsState.asReadonly();

  /**
   * Ricostruisce completamente l'indice a partire dal dataset degli articoli.
   *
   * Durante SSR l'indice rimane vuoto perché la segmentazione del body utilizza DOMParser, disponibile soltanto nel browser.
   *
   * @param articles Dataset corrente degli articoli.
   */
  rebuild(articles: Article[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const segments = articles.flatMap((article) =>
      buildArticleSearchSegments(article)
    );

    this.segmentsState.set(segments);
    this.statusState.set('ready');

  }
}
