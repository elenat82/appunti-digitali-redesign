import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Article } from '../../../core/models/article.model';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArticlesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ArticlesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve articles by area', () => {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Primo articolo HTML',
        path: 'html/primo-articolo-html',
        area: 'html',
        body: '<p>Lorem ipsum</p>',
        externalLinks: [],
        weight: 0
      },
      {
        id: 2,
        title: 'Secondo articolo HTML',
        path: 'html/secondo-articolo-html',
        area: 'html',
        body: '<p>Lorem ipsum 2</p>',
        externalLinks: [],
        weight: 1
      }
    ];

    service.getByArea('html').subscribe((articles) => {
      expect(articles).toEqual(mockArticles);
    });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/articles/html`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockArticles);
  });
});
