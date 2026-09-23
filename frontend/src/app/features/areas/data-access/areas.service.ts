import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Area } from '../../../core/models/area.model';

/**
 * Gestisce l'accesso alle API Drupal relative alle aree tematiche.
 *
 * Le aree vengono recuperate dinamicamente dal backend, in modo che il frontend non mantenga un elenco statico delle tecnologie disponibili.
 *
 */

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera le aree tematiche attualmente esposte da Drupal.
   *
   * @returns Le aree disponibili nell'ordine definito dal backend.
   */
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiBaseUrl}/api/areas`);
  }
}
