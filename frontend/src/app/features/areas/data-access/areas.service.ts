import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Area } from '../../../core/models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private readonly http = inject(HttpClient);

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${environment.apiBaseUrl}/api/areas`);
  }
}
