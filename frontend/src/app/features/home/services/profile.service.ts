import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Profile } from '../../../core/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera il profilo pubblico utilizzato nella home.
   */
  getProfile(): Observable<Profile | null> {
    return this.http
      .get<Profile[]>(
        `${environment.apiBaseUrl}/api/profile?_format=json`
      )
      .pipe(
        map((profiles) => profiles[0] ?? null)
      );
  }
}
