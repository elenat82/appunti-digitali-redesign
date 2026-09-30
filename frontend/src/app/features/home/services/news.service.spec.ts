import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { NewsItem } from '../../../core/models/news-item.model';
import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(
      NewsService
    );

    httpTesting = TestBed.inject(
      HttpTestingController
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve RSS news', () => {
    const mockNews: NewsItem[] = [
      {
        id: 244,
        title: 'Poetic CSS',
        url: 'https://example.com/poetic-css',
        source: 'Brad Frost',
        author: 'Brad Frost',
        date: 1790121600
      },
      {
        id: 243,
        title: 'Dark mode toggles',
        url: 'https://example.com/dark-mode',
        source: 'Lea Verou',
        author: null,
        date: 1788307200
      }
    ];

    service.getNews().subscribe(
      (news) => {
        expect(news).toEqual(
          mockNews
        );
      }
    );

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/news`
    );

    expect(request.request.method).toBe(
      'GET'
    );

    request.flush(mockNews);
  });
});
