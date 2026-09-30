import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import {
  SavedResource
} from '../../../core/models/saved-resource.model';
import {
  SavedResourcesService
} from './saved-resources.service';

describe('SavedResourcesService', () => {
  let service: SavedResourcesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SavedResourcesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(
      SavedResourcesService
    );

    httpTesting = TestBed.inject(
      HttpTestingController
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve saved resources', () => {
    const mockResources: SavedResource[] = [
      {
        id: 1,
        title: 'Drupal Entity API',
        url: 'https://example.com/drupal',
        tags: [
          'Drupal',
          'PHP'
        ]
      },
      {
        id: 2,
        title: 'Angular Signals',
        url: 'https://example.com/angular',
        tags: [
          'Angular'
        ]
      }
    ];

    service.getSavedResources().subscribe(
      (resources) => {
        expect(resources).toEqual(
          mockResources
        );
      }
    );

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/saved-resources`
    );

    expect(request.request.method).toBe(
      'GET'
    );

    request.flush(mockResources);
  });
});
