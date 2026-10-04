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
    }),

    closeResults: vi.fn()
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

  it('associa una label accessibile al campo di ricerca', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const label =
      element.querySelector<HTMLLabelElement>(
        'label[for="global-search"]'
      );

    const input =
      element.querySelector<HTMLInputElement>(
        '#global-search'
      );

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    expect(
      label?.textContent?.trim()
    ).toBe('Cerca negli appunti');

    expect(label?.htmlFor).toBe(
      input?.id
    );
  });

  it('chiude i risultati con Escape senza modificare la query', () => {
    queryState.set('Drupal');
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector(
        '#global-search'
      );

    const event = new KeyboardEvent(
      'keydown',
      {
        key: 'Escape',
        bubbles: true,
        cancelable: true
      }
    );

    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    expect(
      searchMock.closeResults
    ).toHaveBeenCalledOnce();

    expect(queryState()).toBe('Drupal');
  });
});
