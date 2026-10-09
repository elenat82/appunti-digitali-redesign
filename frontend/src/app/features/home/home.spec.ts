import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { Profile } from '../../core/models/profile.model';
import { ProfileService } from '../../core/data-access/profile.service';
import { Home } from './home';
import { StackOverflowQuestion } from '../../core/models/stack-overflow-question.model';
import { StackOverflowService } from './services/stack-overflow.service';
import { GitHubRepository } from '../../core/models/github-repository.model';
import { GitHubService } from './services/github.service';
import { NewsItem } from '../../core/models/news-item.model';
import { NewsService } from './services/news.service';
import { SavedResource } from '../../core/models/saved-resource.model';
import { SavedResourcesService } from './services/saved-resources.service';
import { EmailActions } from '../../shared/components/email-actions/email-actions';

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

  let profile$:
    Subject<Profile | null>;

  const profileServiceMock = {
    getProfile: vi.fn(
      () => profile$.asObservable()
    )
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

  let savedResources$:
    Subject<SavedResource[]>;

  const savedResourcesServiceMock = {
    getSavedResources: vi.fn(
      () => savedResources$.asObservable()
    )
  };

  const mockSavedResources: SavedResource[] = [
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

  beforeEach(async () => {

    news$ = new Subject<NewsItem[]>();

    stackOverflowQuestions$ =
      new Subject<StackOverflowQuestion[]>();

    gitHubRepositories$ =
      new Subject<GitHubRepository[]>();

    savedResources$ =
      new Subject<SavedResource[]>();

    profile$ =
      new Subject<Profile | null>();

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
        },
        {
          provide: SavedResourcesService,
          useValue: savedResourcesServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(
      fixture.componentInstance
    ).toBeTruthy();

    expect(document.title).toBe(
      'Appunti Digitali | Gli appunti di una Front End Developer'
    );

    expect(
      document
        .querySelector<HTMLMetaElement>(
          'meta[name="description"]'
        )
        ?.content
    ).toBe(
      'Gli appunti di una Front End Developer su HTML, CSS, JavaScript, Angular, Drupal e tutto ciò che riguarda il web.'
    );

    expect(
      document
        .head
        .querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        )
        ?.href
    ).toBe(
      'https://www.appunti-digitali.it/'
    );
  });

  it('espone una live region condivisa per i feedback della home', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const liveRegion =
      element.querySelector<HTMLElement>(
        '.home-accessibility-status'
      );

    expect(liveRegion).toBeTruthy();

    expect(
      liveRegion?.getAttribute('aria-live')
    ).toBe('polite');

    expect(
      liveRegion?.getAttribute('aria-atomic')
    ).toBe('true');

    expect(
      liveRegion?.textContent?.trim()
    ).toBe('');
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

  it('shows the public profile', async () => {
    vi.useFakeTimers();

    profile$.next(mockProfile);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent).toContain(
      'Elena Trudini'
    );

    expect(element.textContent).toContain(
      'FrontEnd Developer'
    );

    const emailActionsDebugElement =
      fixture.debugElement.query(
        By.directive(EmailActions)
      );

    expect(emailActionsDebugElement).toBeTruthy();

    const emailActions = emailActionsDebugElement.componentInstance as EmailActions;

    expect(emailActions.email()).toBe(
      mockProfile.email
    );

    expect(element.textContent).toContain(
      'Presentazione'
    );
  });

  it('shows profile loading state', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-contact'
      );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');
  });

  it('shows profile not-found state', async () => {
    vi.useFakeTimers();

    profile$.next(null);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-contact'
      );

    expect(
      section?.textContent
    ).toContain('Profilo non disponibile.');

    // 'not-found' è una risposta valida,
    // il retry è disponibile solo in caso di errore.
    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeNull();
  });

  it('shows profile error state', () => {
    profile$.error(
      new Error('Profile unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-contact'
      );

    const status =
      section?.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status).toBeTruthy();

    expect(
      status?.textContent
    ).toContain(
      'Impossibile caricare i contatti.'
    );

    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeTruthy();
  });

  it('retries public profile after an error', async () => {
    vi.useFakeTimers();

    profile$.error(
      new Error('Profile unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-contact'
      );

    const retryButton =
      section?.querySelector<HTMLButtonElement>(
        '.home-section-retry'
      );

    expect(retryButton).toBeTruthy();

    profile$ =
      new Subject<Profile | null>();

    retryButton?.click();
    fixture.detectChanges();

    const liveRegion =
      element.querySelector<HTMLElement>(
        '.home-accessibility-status'
      );

    expect(
      liveRegion?.textContent?.trim()
    ).toBe(
      'Ricaricamento del profilo...'
    );

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    expect(
      profileServiceMock.getProfile
    ).toHaveBeenCalledTimes(2);

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    profile$.next(mockProfile);
    fixture.detectChanges();

    // I dati sono arrivati, ma il loader resta visibile
    // per i 500 ms previsti.
    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('false');

    expect(
      section?.textContent
    ).toContain('Elena Trudini');

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();

    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeNull();
  });

  it('shows news loading state', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-news'
      );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');
  });

  it('shows news', async () => {
    vi.useFakeTimers();

    news$.next(mockNews);

    await vi.advanceTimersByTimeAsync(500);
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

  it('shows news empty state', async () => {
    vi.useFakeTimers();

    news$.next([]);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-news'
      );

    expect(
      section?.textContent
    ).toContain(
      'Nessuna notizia disponibile.'
    );
  });

  it('hides the author when it is not available', async () => {
    vi.useFakeTimers();

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

    await vi.advanceTimersByTimeAsync(500);
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

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-news'
      );

    const status =
      section?.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status).toBeTruthy();

    expect(
      status?.textContent
    ).toContain(
      'Impossibile caricare le notizie.'
    );
  });

  it('loads news', () => {
    expect(
      newsServiceMock.getNews
    ).toHaveBeenCalledTimes(1);
  });

  it('retries news after an error', async () => {
    vi.useFakeTimers();

    news$.error(
      new Error('News unavailable')
    );

    fixture.detectChanges();
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-news'
      );

    const retryButton =
      section?.querySelector<HTMLButtonElement>(
        '.home-section-retry'
      );

    expect(retryButton).toBeTruthy();

    news$ = new Subject<NewsItem[]>();

    retryButton?.click();
    fixture.detectChanges();

    expect(
      element
        .querySelector<HTMLElement>(
          '.home-accessibility-status'
        )
        ?.textContent
        ?.trim()
    ).toBe(
      'Ricaricamento delle notizie...'
    );

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    expect(
      newsServiceMock.getNews
    ).toHaveBeenCalledTimes(2);

    // Verifica una sola volta che il retry sia isolato alla sezione:
    // gli altri service non devono essere richiamati.
    expect(
      stackOverflowServiceMock.getQuestions
    ).toHaveBeenCalledTimes(1);

    expect(
      gitHubServiceMock.getStarredRepositories
    ).toHaveBeenCalledTimes(1);

    expect(
      savedResourcesServiceMock.getSavedResources
    ).toHaveBeenCalledTimes(1);

    expect(
      profileServiceMock.getProfile
    ).toHaveBeenCalledTimes(1);

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    news$.next(mockNews);
    fixture.detectChanges();

    // I dati sono arrivati, ma il loader resta visibile per i 500 ms previsti.
    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('false');


    expect(
      section?.textContent
    ).toContain('Poetic CSS');

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();
  });

  it('shows Stack Overflow loading state', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-stack-overflow'
      );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');
  });

  it('shows Stack Overflow questions', async () => {
    vi.useFakeTimers();

    stackOverflowQuestions$.next(mockQuestions);

    await vi.advanceTimersByTimeAsync(500);
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
      'angular'
    );

    expect(section?.textContent).toContain(
      'typescript'
    );
  });

  it('shows Stack Overflow empty state', async () => {
    vi.useFakeTimers();

    stackOverflowQuestions$.next([]);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-stack-overflow'
      );

    expect(
      section?.textContent
    ).toContain(
      'Nessuna domanda disponibile.'
    );
  });

  it('shows Stack Overflow error state', () => {
    stackOverflowQuestions$.error(
      new Error('Stack Overflow unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-stack-overflow'
      );

    const status =
      section?.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status).toBeTruthy();

    expect(
      status?.textContent
    ).toContain(
      'Impossibile caricare le domande Stack Overflow.'
    );
  });

  it('loads Stack Overflow questions', () => {
    expect(
      stackOverflowServiceMock.getQuestions
    ).toHaveBeenCalledTimes(1);
  });

  it('retries Stack Overflow questions after an error', async () => {
    vi.useFakeTimers();

    stackOverflowQuestions$.error(
      new Error('Stack Overflow questions unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-stack-overflow'
      );

    const retryButton =
      section?.querySelector<HTMLButtonElement>(
        '.home-section-retry'
      );

    expect(retryButton).toBeTruthy();

    stackOverflowQuestions$ =
      new Subject<StackOverflowQuestion[]>();

    retryButton?.click();
    fixture.detectChanges();

    expect(
      element
        .querySelector<HTMLElement>(
          '.home-accessibility-status'
        )
        ?.textContent
        ?.trim()
    ).toBe(
      'Ricaricamento delle domande Stack Overflow...'
    );


    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    expect(
      stackOverflowServiceMock.getQuestions
    ).toHaveBeenCalledTimes(2);

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    stackOverflowQuestions$.next(mockQuestions);
    fixture.detectChanges();

    // I dati sono arrivati, ma il delay non è ancora terminato.
    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    // I dati sono arrivati, ma il loader resta visibile
    // per i 500 ms previsti.
    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('false');

    expect(
      section?.textContent
    ).toContain(
      'How to test an Angular service?'
    );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();

    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeNull();
  });

  it('shows GitHub loading state', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-github'
      );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');
  });

  it('shows GitHub repositories', async () => {
    vi.useFakeTimers();

    gitHubRepositories$.next(mockRepositories);

    await vi.advanceTimersByTimeAsync(500);
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
      'javascript'
    );

    expect(section?.textContent).toContain(
      'vanilla-javascript'
    );

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();
  });

  it('shows GitHub empty state', async () => {
    vi.useFakeTimers();

    gitHubRepositories$.next([]);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-github'
      );

    expect(
      section?.textContent
    ).toContain(
      'Nessun repository disponibile.'
    );
  });

  it('shows GitHub error state', () => {
    gitHubRepositories$.error(
      new Error('GitHub unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-github'
      );

    const status =
      section?.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status).toBeTruthy();

    expect(
      status?.textContent
    ).toContain(
      'Impossibile caricare i repository GitHub starred.'
    );
  });

  it('loads GitHub repositories', () => {
    expect(
      gitHubServiceMock.getStarredRepositories
    ).toHaveBeenCalledTimes(1);
  });

  it('retries GitHub starred repositories after an error', async () => {
    vi.useFakeTimers();

    gitHubRepositories$.error(
      new Error('GitHub repositories unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-github'
      );

    const retryButton =
      section?.querySelector<HTMLButtonElement>(
        '.home-section-retry'
      );

    expect(retryButton).toBeTruthy();

    gitHubRepositories$ = new Subject<GitHubRepository[]>();

    retryButton?.click();
    fixture.detectChanges();

    expect(
      element
        .querySelector<HTMLElement>(
          '.home-accessibility-status'
        )
        ?.textContent
        ?.trim()
    ).toBe(
      'Ricaricamento dei repository GitHub starred...'
    );

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    expect(
      gitHubServiceMock.getStarredRepositories
    ).toHaveBeenCalledTimes(2);

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    gitHubRepositories$.next(mockRepositories);
    fixture.detectChanges();

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('false');


    expect(
      section?.textContent
    ).toContain('UI-Design');

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();

    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeNull();
  });

  it('shows saved resources loading state', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-saved-resources'
      );
    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');
  });

  it('shows saved resources', async () => {
    vi.useFakeTimers();

    savedResources$.next(mockSavedResources);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const section: HTMLElement | null =
      fixture.nativeElement.querySelector(
        '.home-saved-resources'
      );

    expect(section).toBeTruthy();

    expect(section?.textContent).toContain(
      'Drupal Entity API'
    );

    expect(section?.textContent).toContain(
      'Angular Signals'
    );

    expect(section?.textContent).toContain(
      'https://example.com/drupal'
    );

    expect(section?.textContent).toContain(
      'Drupal'
    );

    expect(section?.textContent).toContain(
      'PHP'
    );

    expect(section?.textContent).toContain(
      'Angular'
    );

    const resources =
      section?.querySelectorAll(
        '.saved-resources-list > li'
      );

    expect(resources?.length).toBe(2);

    const firstLink =
      section?.querySelector<HTMLAnchorElement>(
        '.saved-resources-list > li a'
      );

    expect(firstLink?.href).toBe(
      'https://example.com/drupal'
    );

    expect(firstLink?.target).toBe('_blank');
  });

  it('shows saved resources empty state', async () => {
    vi.useFakeTimers();

    savedResources$.next([]);

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-saved-resources'
      );

    expect(
      section?.textContent
    ).toContain(
      'Nessuna risorsa salvata.'
    );
  });

  it('shows saved resources error state', () => {
    savedResources$.error(
      new Error('Saved resources unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-saved-resources'
      );

    const status =
      section?.querySelector<HTMLElement>(
        '[role="status"]'
      );

    expect(status).toBeTruthy();

    expect(
      status?.textContent
    ).toContain(
      'Impossibile caricare le risorse salvate.'
    );
  });

  it('loads saved resources', () => {
    expect(
      savedResourcesServiceMock.getSavedResources
    ).toHaveBeenCalledTimes(1);
  });

  it('retries saved resources after an error', async () => {
    vi.useFakeTimers();
    savedResources$.error(
      new Error('Saved resources unavailable')
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const section =
      element.querySelector<HTMLElement>(
        '.home-saved-resources'
      );

    const retryButton =
      section?.querySelector<HTMLButtonElement>(
        '.home-section-retry'
      );

    expect(retryButton).toBeTruthy();

    savedResources$ = new Subject<SavedResource[]>();

    retryButton?.click();
    fixture.detectChanges();

    expect(
      element
        .querySelector<HTMLElement>(
          '.home-accessibility-status'
        )
        ?.textContent
        ?.trim()
    ).toBe(
      'Ricaricamento delle risorse salvate...'
    );

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('true');

    expect(
      savedResourcesServiceMock.getSavedResources
    ).toHaveBeenCalledTimes(2);

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    savedResources$.next(mockSavedResources);
    fixture.detectChanges();

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();

    expect(
      section?.getAttribute('aria-busy')
    ).toBe('false');

    expect(
      section?.textContent
    ).toContain('Drupal Entity API');

    expect(
      section?.querySelector(
        'app-loading-indicator'
      )
    ).toBeNull();

    expect(
      section?.querySelector(
        '.home-section-retry'
      )
    ).toBeNull();
  });

});
