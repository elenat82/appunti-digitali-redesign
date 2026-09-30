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
import {
  GitHubRepository
} from '../../core/models/github-repository.model';
import {
  GitHubService
} from './services/github.service';
import {
  NewsItem
} from '../../core/models/news-item.model';
import {
  NewsService
} from './services/news.service';

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

  let news$:
    Subject<NewsItem[]>;

  const newsServiceMock = {
    getNews: vi.fn(
      () => news$.asObservable()
    )
  };

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
      author: 'Lea Verou',
      date: 1788307200
    }
  ];

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

  let gitHubRepositories$:
    Subject<GitHubRepository[]>;

  const gitHubServiceMock = {
    getStarredRepositories: vi.fn(
      () => gitHubRepositories$.asObservable()
    )
  };

  const mockRepositories: GitHubRepository[] = [
    {
      id: 12345,
      name: 'learn-vanilla-js',
      fullName: 'snipcart/learn-vanilla-js',
      url: 'https://github.com/snipcart/learn-vanilla-js',
      description: 'Open source list of paid & free resources to learn vanilla JavaScript',
      language: '',
      stars: 1521,
      topics: ['javascript', 'vanilla-javascript', 'vanilla-js', 'vanillajs'],
    },
    {
      id: 67890,
      name: 'UI-Design',
      fullName: 'tipoqueno/UI-Design',
      url: 'https://github.com/tipoqueno/UI-Design',
      description: ':fire: A curated list of useful resources related to User Interface Design',
      language: '',
      stars: 591,
      topics: ['awesome', 'awesome-list', 'design-patterns', 'design-systems', 'interfaces', 'principles', 'ui', 'ui-design', 'ux'],
    }
  ];

  beforeEach(async () => {

    news$ =
      new Subject<NewsItem[]>();

    stackOverflowQuestions$ =
      new Subject<StackOverflowQuestion[]>();

    gitHubRepositories$ =
      new Subject<GitHubRepository[]>();

    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock
        },
        {
          provide: NewsService,
          useValue: newsServiceMock
        },
        {
          provide: StackOverflowService,
          useValue: stackOverflowServiceMock
        },
        {
          provide: GitHubService,
          useValue: gitHubServiceMock
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

  /* SEZIONE NOTIZIE ------------------------------------------------------------ */

  it('shows news loading state', () => {
    expect(
      fixture.nativeElement.textContent
    ).toContain('Caricamento news...');
  });

  it('shows news', () => {
    news$.next(mockNews);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section = element.querySelector(
      '.home-news'
    );

    expect(section).toBeTruthy();

    expect(section?.textContent).toContain(
      'Poetic CSS'
    );

    expect(section?.textContent).toContain(
      'Dark mode toggles'
    );

    const newsItems = section?.querySelectorAll(
      '.news-list > li'
    );

    expect(newsItems?.length).toBe(2);

    const firstLink =
      section?.querySelector<HTMLAnchorElement>(
        '.news-list > li a'
      );

    expect(firstLink?.href).toBe(
      'https://example.com/poetic-css'
    );

    expect(firstLink?.target).toBe('_blank');

    expect(section?.textContent).toContain(
      'Fonte: Brad Frost'
    );

    expect(section?.textContent).toContain(
      'Autore: Brad Frost'
    );

    expect(section?.textContent).toContain(
      'Data: 23/09/2026'
    );
  });

  it('shows news empty state', () => {
    news$.next([]);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Nessuna notizia disponibile.'
    );
  });

  it('hides the author when it is not available', () => {
    news$.next([
      {
        id: 244,
        title: 'Article without author',
        url: 'https://example.com/article',
        source: 'Example source',
        author: null,
        date: 1790121600
      }
    ]);

    fixture.detectChanges();

    const section: HTMLElement | null =
      fixture.nativeElement.querySelector(
        '.home-news'
      );

    expect(section?.textContent).toContain(
      'Fonte: Example source'
    );

    expect(section?.textContent).not.toContain(
      'Autore:'
    );
  });

  it('shows news error state', () => {
    news$.error(
      new Error('News unavailable')
    );

    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Impossibile caricare le notizie.'
    );
  });

  it('loads news', () => {
    expect(
      newsServiceMock.getNews
    ).toHaveBeenCalledTimes(1);
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

  it('shows GitHub  loading state', () => {
    expect(
      fixture.nativeElement.textContent
    ).toContain('Caricamento repository...');
  });

  it('shows GitHub repositories', () => {
    gitHubRepositories$.next(mockRepositories);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section = element.querySelector(
      '.home-github'
    );

    expect(section).toBeTruthy();

    expect(section?.textContent).toContain(
      'UI-Design'
    );

    expect(section?.textContent).toContain(
      ':fire: A curated list of useful resources related to User Interface Design'
    );

    const repositories = section?.querySelectorAll(
      '.github-list > li'
    );

    expect(repositories?.length).toBe(2);

    const firstLink =
      section?.querySelector<HTMLAnchorElement>(
        '.github-list > li a'
      );

    expect(firstLink?.href).toBe(
      'https://github.com/snipcart/learn-vanilla-js'
    );

    expect(firstLink?.target).toBe('_blank');

    expect(section?.textContent).toContain(
      'Descrizione: Open source list of paid & free resources to learn vanilla JavaScript'
    );

    expect(section?.textContent).toContain(
      'Linguaggio: '
    );

    expect(section?.textContent).toContain(
      'javascript'
    );

    expect(section?.textContent).toContain(
      'vanilla-javascript'
    );
  });

  it('shows GitHub empty state', () => {
    gitHubRepositories$.next([]);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain('Nessun repository disponibile.');
  });

  it('shows GitHub error state', () => {
    gitHubRepositories$.error(
      new Error('GitHub unavailable')
    );

    fixture.detectChanges();

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Impossibile caricare i repository GitHub starred.'
    );
  });

  it('loads GitHub repositories', () => {
    expect(
      gitHubServiceMock.getStarredRepositories
    ).toHaveBeenCalledTimes(1);
  });
});
