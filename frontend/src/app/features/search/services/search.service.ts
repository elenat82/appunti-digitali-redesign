import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  toObservable,
  toSignal
} from '@angular/core/rxjs-interop';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import { SearchOccurrence } from '../models/search-occurrence.model';
import { findSearchOccurrences } from '../utils/find-search-occurrences';
import { SearchIndexService } from './search-index.service';
import { Article } from '../../../core/models/article.model';
import { SearchResultGroup } from '../models/search-result.model';
import { buildSearchResultGroups } from '../utils/build-search-result-groups';

const MIN_QUERY_LENGTH = 3;

/**
 * Gestisce lo stato condiviso e l'esecuzione della ricerca.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly searchIndex = inject(SearchIndexService);

  private readonly queryState = signal('');

  private readonly debouncedQuery = toSignal(
    toObservable(this.queryState).pipe(
      debounceTime(150),
      distinctUntilChanged()
    ),
    {
      initialValue: ''
    }
  );

  readonly isQueryPending = computed(() => {
    const query = this.queryState().trim();

    if (query.length < MIN_QUERY_LENGTH) {
      return false;
    }

    return (
      query !==
      this.debouncedQuery().trim()
    );
  });

  private readonly resultsOpenState = signal(false);

  /**
   * Indica se il pannello dei risultati è visibile.
   */
  readonly isResultsOpen = this.resultsOpenState.asReadonly();

  private readonly articlesState = signal<readonly Article[]>([]);

  /**
   * Query corrente inserita dall'utente.
   */
  readonly query = this.queryState.asReadonly();

  /**
   * Stato corrente dell'indice di ricerca.
   */
  readonly indexStatus = this.searchIndex.status;

  /**
   * Occorrenze corrispondenti alla query corrente.
   */
  readonly occurrences = computed<SearchOccurrence[]>(() => {
    const currentQuery =
      this.queryState().trim();

    const query =
      this.debouncedQuery().trim();

    const indexStatus =
      this.searchIndex.status();

    const isPending =
      this.isQueryPending();

    if (
      currentQuery.length < MIN_QUERY_LENGTH ||
      isPending ||
      indexStatus !== 'ready'
    ) {
      return [];
    }

    return findSearchOccurrences(
      this.searchIndex.segments(),
      query
    );
  });

  /**
 * Risultati pronti per la presentazione, raggruppati per articolo.
 */
  readonly resultGroups = computed<SearchResultGroup[]>(() => {
    const occurrences = this.occurrences();

    if (!occurrences.length) {
      return [];
    }

    return buildSearchResultGroups(
      this.articlesState(),
      this.searchIndex.segments(),
      occurrences
    );
  });

  /**
   * Numero totale delle occorrenze trovate.
   */
  readonly occurrenceCount = computed(
    () => this.occurrences().length
  );

  /**
   * Identificativi degli articoli che contengono almeno un'occorrenza.
   */
  readonly articleIds = computed(() => [
    ...new Set(
      this.occurrences().map(
        (occurrence) => occurrence.articleId
      )
    )
  ]);

  /**
   * Numero di articoli interessati dalla ricerca.
   */
  readonly articleCount = computed(
    () => this.articleIds().length
  );

  /**
 * Aggiorna il dataset degli articoli utilizzato dalla ricerca
 * e ricostruisce il relativo indice.
 *
 * @param articles Dataset corrente degli articoli.
 */
  updateArticles(articles: readonly Article[]): void {
    this.articlesState.set(articles);
    this.searchIndex.rebuild(articles);
  }

  /**
   * Aggiorna la query corrente.
   *
   * @param query Nuova query inserita dall'utente.
   */
  setQuery(query: string): void {
    this.queryState.set(query);

    this.resultsOpenState.set(
      query.trim().length >= MIN_QUERY_LENGTH
    );
  }

  /**
 * Mostra il pannello dei risultati se esiste una query.
 */
  openResults(): void {
    if (this.query().trim()) {
      this.resultsOpenState.set(true);
    }
  }

  /**
   * Nasconde il pannello dei risultati senza perdere
   * lo stato della ricerca corrente.
   */
  closeResults(): void {
    this.resultsOpenState.set(false);
  }
}
