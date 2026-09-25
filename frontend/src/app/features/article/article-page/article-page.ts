import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, last, map, of, switchMap } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { ContentRepositoryService } from '../../../core/data-access/content-repository.service';

interface ArticlePageState {
  status: 'loading' | 'ready' | 'not-found' | 'error';
  article: Article | null;
}

/**
 * Pagina pubblica di un singolo articolo tecnico.
 */
@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePage {
  private readonly route = inject(ActivatedRoute);
  private readonly contentRepository = inject(ContentRepositoryService);

  /**
   * Stato dell'articolo identificato dai parametri area e slug della route.
   */
  readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const area = params.get('area');
        const slug = params.get('slug');

        if (!area || !slug) {
          return of<ArticlePageState>({
            status: 'not-found',
            article: null,
          });
        }

        const path = `/${area}/${slug}`;

        return this.contentRepository.getArticlesByArea(area).pipe(
          last(),
          map((articles) => {
            const article =
              articles.find((item) => item.path === path) ?? null;

            return article
              ? {
                  status: 'ready' as const,
                  article,
                }
              : {
                  status: 'not-found' as const,
                  article: null,
                };
          }),
          catchError(() =>
            of<ArticlePageState>({
              status: 'error',
              article: null,
            }),
          ),
        );
      }),
    ),
    {
      initialValue: {
        status: 'loading',
        article: null,
      } satisfies ArticlePageState,
    },
  );
}
