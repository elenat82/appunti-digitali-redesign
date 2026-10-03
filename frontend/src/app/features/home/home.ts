import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  delay,
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
import {
  LoadingIndicator
} from '../../shared/components/loading-indicator/loading-indicator';
import { EmailActions } from '../../shared/components/email-actions/email-actions';

interface HomeProfileState {
  /**
   * 'not-found' indica che la richiesta è andata a buon fine, ma non esiste un profilo pubblico disponibile.
   * 'error' indica invece che la richiesta non è stata completata correttamente, ad esempio per un errore HTTP o del backend.
   */
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

const LOADING_COMPLETION_DELAY_MS = 500;

/**
 * Pagina iniziale pubblica dell'applicazione.
 */
@Component({
  selector: 'app-home',
  imports: [DatePipe, LoadingIndicator, EmailActions],
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
  private readonly newsRetry$ = new Subject<void>();
  private readonly stackOverflowRetry$ = new Subject<void>();
  private readonly gitHubRetry$ = new Subject<void>();
  private readonly profileRetry$ = new Subject<void>();

  /**
   * Stato del profilo pubblico mostrato nella home.
   */
  readonly profileState = toSignal(
    this.profileRetry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.profileService
          .getProfile()
          .pipe(
            delay(LOADING_COMPLETION_DELAY_MS),
            map((profile): HomeProfileState =>
              profile
                ? {
                  status: 'ready',
                  profile
                }
                : {
                  status: 'not-found',
                  profile: null
                }
            ),
            catchError(() =>
              of<HomeProfileState>({
                status: 'error',
                profile: null
              })
            ),
            startWith<HomeProfileState>({
              status: 'loading',
              profile: null
            })
          )
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
    this.newsRetry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.newsService
          .getNews()
          .pipe(
            delay(LOADING_COMPLETION_DELAY_MS),
            map((news): NewsState =>
              news.length > 0
                ? {
                  status: 'ready',
                  news
                }
                : {
                  status: 'empty',
                  news: []
                }
            ),
            catchError(() =>
              of<NewsState>({
                status: 'error',
                news: []
              })
            ),
            startWith<NewsState>({
              status: 'loading',
              news: []
            })
          )
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
    this.stackOverflowRetry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.stackOverflowService
          .getQuestions()
          .pipe(
            delay(LOADING_COMPLETION_DELAY_MS),
            map((questions): StackOverflowState =>
              questions.length > 0
                ? {
                  status: 'ready',
                  questions
                }
                : {
                  status: 'empty',
                  questions: []
                }
            ),
            catchError(() =>
              of<StackOverflowState>({
                status: 'error',
                questions: []
              })
            ),
            startWith<StackOverflowState>({
              status: 'loading',
              questions: []
            })
          )
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
    this.gitHubRetry$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.githubService
          .getStarredRepositories()
          .pipe(
            delay(LOADING_COMPLETION_DELAY_MS),
            map((repositories): GitHubState =>
              repositories.length > 0
                ? {
                  status: 'ready',
                  repositories
                }
                : {
                  status: 'empty',
                  repositories: []
                }
            ),
            catchError(() =>
              of<GitHubState>({
                status: 'error',
                repositories: []
              })
            ),
            startWith<GitHubState>({
              status: 'loading',
              repositories: []
            })
          )
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
            delay(LOADING_COMPLETION_DELAY_MS),
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

  /**
 * Ripete il caricamento delle news.
 */
  retryNews(): void {
    this.newsRetry$.next();
  }

  /**
 * Ripete il caricamento delle domande Stack Overflow.
 */
  retryStackOverflow(): void {
    this.stackOverflowRetry$.next();
  }

  /**
 * Ripete il caricamento dei repository GitHub starred.
 */
  retryGitHubStarred(): void {
    this.gitHubRetry$.next();
  }

  /**
 * Ripete il caricamento del profilo pubblico.
 */
  retryProfile(): void {
    this.profileRetry$.next();
  }

}
