import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { of, Subject } from 'rxjs';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from './services/profile.service';
import { Home } from './home';
import {
  StackOverflowQuestion
} from '../../core/models/stack-overflow-question.model';
import {
  StackOverflowService
} from './services/stack-overflow.service';

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

  let stackOverflowQuestions$:
    Subject<StackOverflowQuestion[]>;

  const stackOverflowServiceMock = {
    getQuestions: vi.fn(
      () => stackOverflowQuestions$.asObservable()
    )
  };

  const mockQuestions: StackOverflowQuestion[] = [
    {
      id: 12345,
      title: 'How to test an Angular service?',
      url: 'https://stackoverflow.com/questions/12345',
      tags: ['angular', 'typescript'],
      score: 5,
      answerCount: 2,
      isAnswered: true,
      lastActivityDate: 1234567890
    },
    {
      id: 67890,
      title: 'Understanding TypeScript interfaces',
      url: 'https://stackoverflow.com/questions/67890',
      tags: ['typescript'],
      score: 3,
      answerCount: 1,
      isAnswered: false,
      lastActivityDate: 1234567891
    }
  ];

  beforeEach(async () => {
    stackOverflowQuestions$ =
      new Subject<StackOverflowQuestion[]>();

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock
        },
        {
          provide: StackOverflowService,
          useValue: stackOverflowServiceMock
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

  it('shows Stack Overflow loading state', () => {
    expect(
      fixture.nativeElement.textContent
    ).toContain('Caricamento domande');
  });

  it('shows Stack Overflow questions', () => {
    stackOverflowQuestions$.next(mockQuestions);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section = element.querySelector(
      '.home-stack-overflow'
    );

    expect(section).toBeTruthy();

    expect(section?.textContent).toContain(
      'How to test an Angular service?'
    );

    expect(section?.textContent).toContain(
      'Understanding TypeScript interfaces'
    );

    const questions = section?.querySelectorAll(
      '.stack-overflow-list > li'
    );

    expect(questions?.length).toBe(2);

    const firstLink =
      section?.querySelector<HTMLAnchorElement>(
        '.stack-overflow-list > li a'
      );

    expect(firstLink?.href).toBe(
      'https://stackoverflow.com/questions/12345'
    );

    expect(firstLink?.target).toBe('_blank');

    expect(section?.textContent).toContain(
      'Score: 5'
    );

    expect(section?.textContent).toContain(
      'Risposte: 2'
    );

    expect(section?.textContent).toContain(
      'angular'
    );

    expect(section?.textContent).toContain(
      'typescript'
    );
  });

  it('shows Stack Overflow empty state', () => {
    stackOverflowQuestions$.next([]);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain('Nessuna domanda disponibile.');
  });

  it('shows Stack Overflow error state', () => {
    stackOverflowQuestions$.error(
      new Error('Stack Overflow unavailable')
    );

    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Impossibile caricare le domande Stack Overflow.'
    );
  });

  it('loads Stack Overflow questions', () => {
    expect(
      stackOverflowServiceMock.getQuestions
    ).toHaveBeenCalledTimes(1);
  });
});
