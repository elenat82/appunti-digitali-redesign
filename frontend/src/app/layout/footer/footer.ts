import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import {
  toSignal
} from '@angular/core/rxjs-interop';
import {
  catchError,
  map,
  of
} from 'rxjs';

import {
  ProfileService
} from '../../core/data-access/profile.service';
import {
  EmailActions
} from '../../shared/components/email-actions/email-actions';
import {
  PrivacyActions
} from '../../shared/components/privacy-actions/privacy-actions';

@Component({
  selector: 'app-footer',
  imports: [
    EmailActions,
    PrivacyActions
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  private readonly profileService =
    inject(ProfileService);

  protected readonly email = toSignal(
    this.profileService.getProfile().pipe(
      map(
        (profile) =>
          profile?.email ?? null
      ),
      catchError(() => of(null))
    ),
    {
      initialValue: null
    }
  );
}
