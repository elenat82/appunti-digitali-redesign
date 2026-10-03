import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable
} from '@angular/core';
import {
  map,
  Observable,
  shareReplay
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly profile$ = this.http
    .get<Profile[]>(
      `${environment.apiBaseUrl}/api/profile?_format=json`
    )
    .pipe(
      map(
        (profiles) =>
          profiles[0] ?? null
      ),
      shareReplay({
        bufferSize: 1,
        refCount: false
      })
    );

  /**
   * Recupera il profilo pubblico condiviso dalle diverse sezioni dell'applicazione.
   */
  getProfile(): Observable<Profile | null> {
    return this.profile$;
  }
}
