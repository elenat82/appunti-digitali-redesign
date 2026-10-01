import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  map,
  of,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { DatePipe } from '@angular/common';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from './services/profile.service';
import { StackOverflowQuestion } from '../../core/models/stack-overflow-question.model';
import { StackOverflowService } from './services/stack-overflow.service';
import { GitHubRepository } from '../../core/models/github-repository.model';
import { GitHubService } from './services/github.service';
import { NewsItem } from '../../core/models/news-item.model';
import { NewsService } from './services/news.service';
import { SavedResource } from '../../core/models/saved-resource.model';
import { SavedResourcesService } from './services/saved-resources.service';

interface HomeProfileState {
  status: 'loading' | 'ready' | 'not-found' | 'error';
  profile: Profile | null;
}

interface StackOverflowState {
  status: 'loading' | 'ready' | 'empty' | 'error';
  questions: StackOverflowQuestion[];
}

interface GitHubState {
  status: 'loading' | 'ready' | 'empty' | 'error';
  repositories: GitHubRepository[];
}

interface NewsState {
  status: 'loading' | 'ready' | 'empty' | 'error';
  news: NewsItem[];
}

interface SavedResourcesState {
  status: 'loading' | 'ready' | 'empty' | 'error';
  resources: SavedResource[];
}

/**
 * Pagina iniziale pubblica dell'applicazione.
 */
@Component({
  selector: 'app-home',
  imports: [DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly profileService = inject(ProfileService);
  private readonly stackOverflowService = inject(StackOverflowService);
  private readonly githubService = inject(GitHubService);
  private readonly newsService = inject(NewsService);
  private readonly savedResourcesService = inject(SavedResourcesService);

  private readonly savedResourcesRetry$ = new Subject<void>();

  /**
   * Stato del profilo pubblico mostrato nella home.
   */
  readonly profileState = toSignal(
    this.profileService.getProfile().pipe(
      map((profile) =>
        profile
          ? {
            status: 'ready' as const,
            profile
          }
          : {
            status: 'not-found' as const,
            profile: null
          }
      ),
      catchError(() =>
        of<HomeProfileState>({
          status: 'error',
          profile: null
        })
      )
    ),
    {
      initialValue: {
        status: 'loading',
        profile: null
      } satisfies HomeProfileState
    }
  );

  readonly newsState = toSignal(
    this.newsService.getNews().pipe(
      map((news) =>
        news.length > 0
          ? {
            status: 'ready' as const,
            news
          }
          : {
            status: 'empty' as const,
            news: []
          }
      ),
      catchError(() =>
        of<NewsState>({
          status: 'error',
          news: []
        })
      )
    ),
    {
      initialValue: {
        status: 'loading',
        news: []
      } satisfies NewsState
    }
  );

  readonly stackOverflowState = toSignal(
    this.stackOverflowService.getQuestions().pipe(
      map((questions) =>
        questions.length > 0
          ? {
            status: 'ready' as const,
            questions
          }
          : {
            status: 'empty' as const,
            questions: []
          }
      ),
      catchError(() =>
        of<StackOverflowState>({
          status: 'error',
          questions: []
        })
      )
    ),
    {
      initialValue: {
        status: 'loading',
        questions: []
      } satisfies StackOverflowState
    }
  );

  readonly gitHubState = toSignal(
    this.githubService.getStarredRepositories().pipe(
      map((repositories) =>
        repositories.length > 0
          ? {
            status: 'ready' as const,
            repositories
          }
          : {
            status: 'empty' as const,
            repositories: []
          }
      ),
      catchError(() =>
        of<GitHubState>({
          status: 'error',
          repositories: []
        })
      )
    ),
    {
      initialValue: {
        status: 'loading',
        repositories: []
      } satisfies GitHubState
    }
  );

  readonly savedResourcesState = toSignal(
    this.savedResourcesRetry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.savedResourcesService
          .getSavedResources()
          .pipe(
            map((resources): SavedResourcesState =>
              resources.length > 0
                ? {
                  status: 'ready',
                  resources
                }
                : {
                  status: 'empty',
                  resources: []
                }
            ),
            catchError(() =>
              of<SavedResourcesState>({
                status: 'error',
                resources: []
              })
            ),
            startWith<SavedResourcesState>({
              status: 'loading',
              resources: []
            })
          )
      )
    ),
    {
      initialValue: {
        status: 'loading',
        resources: []
      } satisfies SavedResourcesState
    }
  );

  /**
 * Ripete il caricamento delle risorse salvate.
 */
  retrySavedResources(): void {
    this.savedResourcesRetry$.next();
  }
}
