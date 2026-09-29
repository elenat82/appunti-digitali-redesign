import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import {
  GitHubRepository
} from '../../../core/models/github-repository.model';
import { GitHubService } from './github.service';

describe('GitHubService', () => {
  let service: GitHubService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GitHubService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(
      GitHubService
    );

    httpTesting = TestBed.inject(
      HttpTestingController
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve starred GitHub repositories', () => {
    const mockRepositories: GitHubRepository[] = [
      {
        id: 12345,
        name: 'You-Dont-Know-JS',
        fullName: 'getify/You-Dont-Know-JS',
        url:
          'https://github.com/getify/You-Dont-Know-JS',
        description: 'A book series (2 published editions) on the JS language.',
        language: '',
        stars: 184983,
        topics: [
          'async',
          'book',
          'book-series',
          'closures',
          'education',
          'es2015',
          'es6',
          'javascript',
          'learn-to-code',
          'programming',
          'prototypes',
          'training-materials',
          'training-providers'
        ]
      }
    ];

    service.getStarredRepositories().subscribe(
      (repositories) => {
        expect(repositories).toEqual(
          mockRepositories
        );
      }
    );

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/github/starred`
    );

    expect(request.request.method).toBe(
      'GET'
    );

    request.flush(mockRepositories);
  });
});
