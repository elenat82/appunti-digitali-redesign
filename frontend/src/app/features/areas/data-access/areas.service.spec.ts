import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Area } from '../../../core/models/area.model';
import { AreasService } from './areas.service';

describe('AreasService', () => {
  let service: AreasService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AreasService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AreasService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve thematic areas', () => {
    const mockAreas: Area[] = [
      {
        id: 'html',
        label: 'HTML',
        iconUrl: 'https://example.com/html.svg',
        weight: 0
      },
      {
        id: 'css',
        label: 'CSS',
        iconUrl: 'https://example.com/css.svg',
        weight: 1
      }
    ];

    service.getAreas().subscribe((areas) => {
      expect(areas).toEqual(mockAreas);
    });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/areas`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockAreas);
  });
});
