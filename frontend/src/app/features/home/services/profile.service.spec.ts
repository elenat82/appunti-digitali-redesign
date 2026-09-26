import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { Profile } from '../../../core/models/profile.model';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(
      HttpTestingController
    );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should retrieve the public profile', () => {
    const mockProfile: Profile = {
      email: 'elena@example.com',
      github: 'https://github.com/elenat82',
      linkedin:
        'https://www.linkedin.com/in/elenatrudini/',
      fullName: 'Elena Trudini',
      presentation: '<p>Presentazione</p>',
      professionalRole: 'FrontEnd Developer',
      phone: '123456789',
      cvUrl: 'https://example.com/cv.pdf',
      pictureUrl: 'https://example.com/picture.png'
    };

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/profile?_format=json`
    );

    expect(request.request.method).toBe('GET');

    request.flush([mockProfile]);
  });

  it('returns null when the profile is missing', () => {
    service.getProfile().subscribe((profile) => {
      expect(profile).toBeNull();
    });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}/api/profile?_format=json`
    );

    request.flush([]);
  });
});
