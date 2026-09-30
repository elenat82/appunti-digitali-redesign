import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  SavedResource
} from '../../../core/models/saved-resource.model';

@Injectable({
  providedIn: 'root'
})
export class SavedResourcesService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera le risorse salvate pubblicate dal backend.
   */
  getSavedResources(): Observable<SavedResource[]> {
    return this.http.get<SavedResource[]>(
      `${environment.apiBaseUrl}/api/saved-resources`
    );
  }
}
