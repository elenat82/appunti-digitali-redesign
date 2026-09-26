import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { of } from 'rxjs';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from './services/profile.service';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

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

  const profileServiceMock = {
    getProfile: vi.fn(() => of(mockProfile))
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(
      fixture.componentInstance
    ).toBeTruthy();
  });

  it('shows the news area', () => {
    expect(
      fixture.nativeElement.querySelector(
        '.home-news'
      )
    ).toBeTruthy();
  });

  it('shows the contact area', () => {
    expect(
      fixture.nativeElement.querySelector(
        '.home-contact'
      )
    ).toBeTruthy();
  });

  it('loads the public profile', () => {
    expect(
      profileServiceMock.getProfile
    ).toHaveBeenCalledOnce();
  });

  it('shows the public profile', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).toContain(
      'Elena Trudini'
    );

    expect(element.textContent).toContain(
      'FrontEnd Developer'
    );

    expect(element.textContent).toContain(
      'elena@example.com'
    );

    expect(element.textContent).toContain(
      'Presentazione'
    );
  });
});
