import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from './services/profile.service';
import { StackOverflowQuestion } from '../../core/models/stack-overflow-question.model';
import { StackOverflowService } from './services/stack-overflow.service';
import { GitHubRepository } from '../../core/models/github-repository.model';
import { GitHubService } from './services/github.service';

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

/**
 * Pagina iniziale pubblica dell'applicazione.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly profileService = inject(ProfileService);
  private readonly stackOverflowService = inject(StackOverflowService);
  private readonly githubService = inject(GitHubService);

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
}
