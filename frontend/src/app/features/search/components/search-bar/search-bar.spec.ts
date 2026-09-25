import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { SearchService } from '../../services/search.service';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let fixture: ComponentFixture<SearchBar>;

  const queryState = signal('');

  const searchMock = {
    query: queryState.asReadonly(),
    setQuery: vi.fn((query: string) => {
      queryState.set(query);
    })
  };

  beforeEach(async () => {
    queryState.set('');
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [
        {
          provide: SearchService,
          useValue: searchMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('aggiorna la query durante la digitazione', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = 'Drupal';
    input.dispatchEvent(new Event('input'));

    expect(searchMock.setQuery).toHaveBeenCalledWith(
      'Drupal'
    );
  });

  it('mostra la query corrente nel campo', () => {
    queryState.set('Queue API');
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('Queue API');
  });
});
