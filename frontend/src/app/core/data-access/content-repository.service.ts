import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  catchError,
  concat,
  defer,
  EMPTY,
  from,
  Observable,
  of,
  switchMap,
  tap,
  throwError
} from 'rxjs';

import { Area } from '../models/area.model';
import { Article } from '../models/article.model';
import { ContentCacheService } from '../storage/content-cache.service';
import { AreasService } from '../../features/areas/data-access/areas.service';
import { ArticlesService } from '../../features/articles/data-access/articles.service';

/**
 * Coordina il recupero dei contenuti tra cache locale e API Drupal.
 *
 * Quando disponibile, la copia presente in IndexedDB viene emessa per prima. Successivamente viene eseguita la richiesta al backend e il dato aggiornato sostituisce la copia presente nella cache locale.
 *
 * Un errore di IndexedDB non impedisce il recupero dei dati da Drupal. Se invece la richiesta HTTP fallisce ma è disponibile una copia locale, quest'ultima rimane utilizzabile.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentRepositoryService {
  private readonly areasService = inject(AreasService);
  private readonly articlesService = inject(ArticlesService);
  private readonly contentCache = inject(ContentCacheService);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Recupera le aree prima dalla cache locale, quando disponibile, e successivamente dal backend Drupal.
   */
  getAreas(): Observable<Area[]> {
    return defer(() => from(this.contentCache.getAreas())).pipe(
      catchError(() => of(null)),
      switchMap((cachedAreas) => {
        const remoteAreas$ = this.areasService.getAreas().pipe(
          tap((areas) => {
            this.persistAreas(areas);
          }),
          catchError((error) => {
            if (cachedAreas !== null) {
              return EMPTY;
            }

            if (!isPlatformBrowser(this.platformId)) {
              return of([] as Area[]);
            }

            return throwError(() => error);
          })
        );

        return cachedAreas !== null
          ? concat(of(cachedAreas), remoteAreas$)
          : remoteAreas$;
      })
    );
  }

  /**
   * Recupera gli articoli di una specifica area prima dalla cache locale, quando disponibile, e successivamente dal backend Drupal.
   *
   * @param areaId Identificativo dell'area tematica.
   */
  getArticlesByArea(areaId: string): Observable<Article[]> {
    return defer(() => from(this.contentCache.getArticles(areaId))).pipe(
      catchError(() => of(null)),
      switchMap((cachedArticles) => {
        const remoteArticles$ = this.articlesService.getByArea(areaId).pipe(
          tap((articles) => {
            this.persistArticles(areaId, articles);
          }),
          catchError((error) =>
            cachedArticles !== null
              ? EMPTY
              : throwError(() => error)
          )
        );

        return cachedArticles !== null
          ? concat(of(cachedArticles), remoteArticles$)
          : remoteArticles$;
      })
    );
  }

  /**
   * Aggiorna la cache delle aree senza ritardare l'emissione della response HTTP.
   */
  private persistAreas(areas: Area[]): void {
    void this.contentCache.setAreas(areas).catch(() => undefined);
  }

  /**
   * Aggiorna la cache degli articoli senza ritardare l'emissione della response HTTP.
   */
  private persistArticles(areaId: string, articles: Article[]): void {
    void this.contentCache
      .setArticles(areaId, articles)
      .catch(() => undefined);
  }
}
