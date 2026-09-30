import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { NewsItem } from '../../../core/models/news-item.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera le notizie RSS selezionate dal backend.
   */
  getNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(
      `${environment.apiBaseUrl}/api/news`
    );
  }
}
