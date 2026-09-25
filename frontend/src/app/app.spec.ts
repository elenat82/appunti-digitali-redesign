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

  const searchMock = {
    query: queryState.asReadonly(),
    setQuery: vi.fn((query: string) => {
      queryState.set(query);
    }),
    updateArticles: vi.fn()
  };

  beforeEach(async () => {
    queryState.set('');
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
