import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  from,
  map,
  mergeMap,
  of,
  scan,
  shareReplay,
  switchMap
} from 'rxjs';

import { Article } from './core/models/article.model';
import { AreasService } from './features/areas/data-access/areas.service';
import { ArticlesService } from './features/articles/data-access/articles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly areasService = inject(AreasService);
  private readonly articlesService = inject(ArticlesService);

  private readonly areas$ = this.areasService.getAreas().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected readonly areas = toSignal(
    this.areas$,
    { initialValue: [] }
  );

  protected readonly articles = toSignal(
    this.areas$.pipe(
      switchMap((areas) =>
        from(areas).pipe(
          mergeMap((area) =>
            this.articlesService.getByArea(area.id).pipe(
              map((articles) => ({
                areaId: area.id,
                articles
              })),
              catchError(() =>
                of({
                  areaId: area.id,
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
          ),
          map((articlesByArea) =>
            areas.flatMap(
              (area) => articlesByArea[area.id] ?? []
            )
          )
        )
      )
    ),
    { initialValue: [] }
  );
}
