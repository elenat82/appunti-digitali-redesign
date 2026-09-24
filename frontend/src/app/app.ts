import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  distinctUntilChanged,
  from,
  map,
  mergeMap,
  of,
  scan,
  shareReplay,
  switchMap
} from 'rxjs';

import { ContentRepositoryService } from './core/data-access/content-repository.service';
import { Article } from './core/models/article.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly contentRepository = inject(ContentRepositoryService);

  private readonly areas$ = this.contentRepository.getAreas().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Espone soltanto gli identificativi delle aree.
   *
   * Una modifica a label, icona, peso o ordine non deve causare un nuovo caricamento degli articoli se l'insieme delle aree è rimasto invariato.
   */
  private readonly areaIds$ = this.areas$.pipe(
    map((areas) => areas.map((area) => area.id)),
    distinctUntilChanged((previous, current) => {
      if (previous.length !== current.length) {
        return false;
      }

      const currentIds = new Set(current);

      return previous.every((areaId) => currentIds.has(areaId));
    })
  );

  private readonly articlesByArea$ = this.areaIds$.pipe(
    switchMap((areaIds) =>
      from(areaIds).pipe(
        mergeMap((areaId) =>
          this.contentRepository.getArticlesByArea(areaId).pipe(
            map((articles) => ({
              areaId,
              articles
            })),
            catchError(() =>
              of({
                areaId,
                articles: [] as Article[]
              })
            )
          )
        ),
        scan(
          (articlesByArea, result) => ({
            ...articlesByArea,
            [result.areaId]: result.articles
          }),
          {} as Record<string, Article[]>
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected readonly areas = toSignal(
    this.areas$,
    { initialValue: [] }
  );

  protected readonly articlesByArea = toSignal(
    this.articlesByArea$,
    { initialValue: {} as Record<string, Article[]> }
  );

  protected readonly articles = computed(() =>
    this.areas().flatMap(
      (area) => this.articlesByArea()[area.id] ?? []
    )
  );
}
