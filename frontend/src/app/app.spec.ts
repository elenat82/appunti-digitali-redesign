import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { App } from './app';
import { ContentRepositoryService } from './core/data-access/content-repository.service';
import { SearchIndexService } from './features/search/services/search-index.service';

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

  const searchIndexMock = {
    rebuild: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ContentRepositoryService,
          useValue: contentRepositoryMock
        },
        {
          provide: SearchIndexService,
          useValue: searchIndexMock
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render the title', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Appunti Digitali'
    );
  });

  it('should render the thematic areas', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('li');

    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('HTML');
    expect(items[1].textContent).toContain('CSS');
  });

  it('should load articles for each thematic area', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledTimes(2);
    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledWith('html');
    expect(contentRepositoryMock.getArticlesByArea).toHaveBeenCalledWith('css');
  });

  it('should build the search index when all article areas are available', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    expect(searchIndexMock.rebuild).toHaveBeenCalledTimes(1);
    expect(searchIndexMock.rebuild).toHaveBeenCalledWith([]);
  });

});
