import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  StackOverflowQuestion
} from '../../../core/models/stack-overflow-question.model';

@Injectable({
  providedIn: 'root'
})
export class StackOverflowService {
  private readonly http = inject(HttpClient);

  /**
   * Recupera le domande Stack Overflow selezionate dal backend.
   */
  getQuestions(): Observable<StackOverflowQuestion[]> {
    return this.http.get<StackOverflowQuestion[]>(
      `${environment.apiBaseUrl}/api/stackoverflow`
    );
  }
}
