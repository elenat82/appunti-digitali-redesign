import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { signal } from '@angular/core';

import { App } from './app';
import { ContentRepositoryService } from './core/data-access/content-repository.service';
import { SearchService } from './features/search/services/search.service';

describe('App', () => {
  const contentRepositoryMock = {
    getAreas: vi.fn(() =>
      of([
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
      ])
    ),
    getArticlesByArea: vi.fn(() => of([]))
  };

  const queryState = signal('');
  const resultsOpenState = signal(false);

  const searchMock = {
    query: queryState.asReadonly(),

    isResultsOpen:
      resultsOpenState.asReadonly(),

    setQuery: vi.fn((query: string) => {
      queryState.set(query);
    }),

    openResults: vi.fn(),

    closeResults: vi.fn(() => {
      resultsOpenState.set(false);
    }),

    updateArticles: vi.fn()
  };
  beforeEach(async () => {
    queryState.set('');
    resultsOpenState.set(false);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ContentRepositoryService,
          useValue: contentRepositoryMock
        },
        {
          provide: SearchService,
          useValue: searchMock
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should not show return to results without a search query', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector(
        '.return-to-results'
      );

    expect(button).toBeNull();
  });

  it('should show return to results when search results are closed', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const button: HTMLButtonElement | null =
      fixture.nativeElement.querySelector(
        '.return-to-results'
      );

    expect(button).not.toBeNull();
    expect(button?.textContent?.trim()).toBe(
      'Torna ai risultati'
    );
  });

  it('should reopen search results from the header', () => {
    queryState.set('Drupal');
    resultsOpenState.set(false);

    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector(
        '.return-to-results'
      );

    button.click();

    expect(
      searchMock.openResults
    ).toHaveBeenCalledTimes(1);
  });

  it('should load articles for each thematic area', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledTimes(2);
    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledWith('html');
    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledWith('css');
  });

  it('should update search data when all article areas are available', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    expect(searchMock.updateArticles).toHaveBeenCalledTimes(1);
    expect(searchMock.updateArticles).toHaveBeenCalledWith([]);
  });

});
