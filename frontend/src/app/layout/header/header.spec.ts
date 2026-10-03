import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { SearchService } from '../../features/search/services/search.service';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;

  const queryState = signal('');
  const resultsOpenState = signal(false);

  const searchMock = {
    query: queryState.asReadonly(),
    isResultsOpen:
      resultsOpenState.asReadonly(),

    setQuery: vi.fn((query: string) => {
      queryState.set(query);
    }),

    openResults: vi.fn(() => {
      resultsOpenState.set(true);
    })
  };

  beforeEach(async () => {
    queryState.set('');
    resultsOpenState.set(false);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        {
          provide: SearchService,
          useValue: searchMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(
      fixture.componentInstance
    ).toBeTruthy();
  });

  it('shows the application title and search bar', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const homeLink =
      element.querySelector<HTMLAnchorElement>(
        '.app-title'
      );

    expect(homeLink?.textContent).toContain(
      'Appunti Digitali'
    );

    expect(
      homeLink?.getAttribute('href')
    ).toBe('/');

    expect(
      element.querySelector('app-search-bar')
    ).toBeTruthy();
  });

  it('hides return to results when the query is empty', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(
      element.querySelector(
        '.return-to-results'
      )
    ).toBeNull();
  });

  it('shows return to results when a query exists and results are closed', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(
      element.querySelector(
        '.return-to-results'
      )
    ).toBeTruthy();
  });

  it('hides return to results when results are already open', () => {
    queryState.set('Drupal');
    resultsOpenState.set(true);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(
      element.querySelector(
        '.return-to-results'
      )
    ).toBeNull();
  });

  it('opens the search results', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.return-to-results'
      );

    button?.click();

    expect(
      searchMock.openResults
    ).toHaveBeenCalledOnce();
  });
});
