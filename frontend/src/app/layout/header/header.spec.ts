import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { SearchService } from '../../features/search/services/search.service';
import { Header } from './header';

@Component({
  template: ''
})
class TestPage { }

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let router: Router;

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
        provideRouter([
          {
            path: '**',
            component: TestPage
          }
        ]),
        {
          provide: SearchService,
          useValue: searchMock
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

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

  it('hides the results action when the query is empty', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(
      element.querySelector(
        '.return-to-results'
      )
    ).toBeNull();
  });

  it('shows "Mostra risultati" when a query exists and results are closed', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.return-to-results'
      );

    expect(button).toBeTruthy();

    expect(
      button?.textContent?.trim()
    ).toBe('Mostra risultati');
  });

  it('shows "Torna ai risultati" when the current URL identifies a search occurrence', async () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    await router.navigateByUrl(
      '/html/articolo-html'
      + '?source=body'
      + '&index=0'
      + '&start=0'
      + '&end=6'
    );

    fixture.detectChanges();
    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.return-to-results'
      );

    expect(button).toBeTruthy();

    expect(
      button?.textContent?.trim()
    ).toBe('Torna ai risultati');
  });

  it('hides the results action when results are already open', () => {
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

  it('opens the search results and focuses the search input', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const button =
      element.querySelector<HTMLButtonElement>(
        '.return-to-results'
      );

    const searchInput =
      element.querySelector<HTMLInputElement>(
        '#global-search'
      );

    button?.focus();

    expect(document.activeElement).toBe(
      button
    );

    button?.click();

    expect(
      searchMock.openResults
    ).toHaveBeenCalledOnce();

    expect(document.activeElement).toBe(
      searchInput
    );
  });
});
