import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  GitHubRepository
} from '../../../core/models/github-repository.model';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera i repository GitHub starred selezionati dal backend.
   */
  getStarredRepositories(): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(
      `${environment.apiBaseUrl}/api/github/starred`
    );
  }
}
