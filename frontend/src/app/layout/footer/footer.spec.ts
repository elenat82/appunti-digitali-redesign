import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import {
  Profile
} from '../../core/models/profile.model';
import {
  ProfileService
} from '../../core/data-access/profile.service';
import {
  EmailActions
} from '../../shared/components/email-actions/email-actions';
import { Footer } from './footer';

describe('Footer', () => {
  let fixture: ComponentFixture<Footer>;
  let profile$: Subject<Profile | null>;

  const profileServiceMock = {
    getProfile: vi.fn(
      () => profile$.asObservable()
    )
  };

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

  beforeEach(async () => {
    profile$ = new Subject<Profile | null>();

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(
      fixture.componentInstance
    ).toBeTruthy();
  });

  it('shows the technologies used to build the site', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).toContain(
      'Made with'
    );

    expect(
      element.querySelector(
        '.icon-app-drupal'
      )
    ).toBeTruthy();

    expect(
      element.querySelector(
        '.icon-app-angular'
      )
    ).toBeTruthy();

    expect(
      element.querySelector(
        '.icon-app-heart'
      )
    ).toBeTruthy();
  });

  it('shows email actions when the profile is available', () => {
    profile$.next(mockProfile);
    fixture.detectChanges();

    const emailActionsDebugElement =
      fixture.debugElement.query(
        By.directive(EmailActions)
      );

    expect(
      emailActionsDebugElement
    ).toBeTruthy();

    const emailActions =
      emailActionsDebugElement.componentInstance as EmailActions;

    expect(emailActions.email()).toBe(
      mockProfile.email
    );

    expect(
      fixture.nativeElement.textContent
    ).toContain('by');
  });

  it('does not show email actions when the profile is missing', () => {
    profile$.next(null);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.directive(EmailActions)
      )
    ).toBeNull();

    expect(
      fixture.nativeElement.textContent
    ).not.toContain('by');
  });

  it('does not show email actions when the profile cannot be loaded', () => {
    profile$.error(
      new Error('Profile unavailable')
    );

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.directive(EmailActions)
      )
    ).toBeNull();

    expect(
      fixture.nativeElement.textContent
    ).not.toContain('by');
  });
});
