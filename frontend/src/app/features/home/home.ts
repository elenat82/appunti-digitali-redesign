import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from './services/profile.service';

interface HomeProfileState {
  status: 'loading' | 'ready' | 'not-found' | 'error';
  profile: Profile | null;
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
  private readonly profileService =
    inject(ProfileService);

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
}
