import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Article } from '../../../core/models/article.model';

/**
 * Gestisce l'accesso alle API Drupal relative agli articoli.
 *
 * Gli articoli vengono recuperati separatamente per area tematica, utilizzando l'identificativo dell'area restituito dal backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera gli articoli appartenenti a una specifica area tematica.
   *
   * @param areaId Identificativo dell'area tematica.
   * @returns Gli articoli pubblicati dell'area nell'ordine definito dal backend.
   */
  getByArea(areaId: string): Observable<Article[]> {
    return this.http.get<Article[]>(
      `${environment.apiBaseUrl}/api/articles/${areaId}`
    );
  }
}
