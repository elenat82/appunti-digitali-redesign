import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchService } from '../../services/search.service';
import {
  Area
} from '../../../../core/models/area.model';

/**
 * Presenta lo stato e i risultati della ricerca globale.
 */
@Component({
  selector: 'app-search-results',
  imports: [RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResults {
  protected readonly search = inject(SearchService);
  private readonly document = inject(DOCUMENT);

  protected readonly statusMessage =
    computed(() => {
      if (
        !this.search.isResultsOpen() ||
        !this.search.query().trim()
      ) {
        return '';
      }

      if (
        this.search.indexStatus() ===
        'preparing'
      ) {
        return 'Preparazione della ricerca...';
      }

      if (this.search.isQueryPending()) {
        return 'Ricerca in corso...';
      }

      if (
        this.search.occurrenceCount() === 0
      ) {
        return (
          'Nessun risultato per ' +
          this.search.query()
        );
      }

      return (
        `${this.search.query()}: ` +
        `${this.search.occurrenceCount()} ` +
        'occorrenze in ' +
        `${this.search.articleCount()} articoli`
      );
    });

  readonly areas =
    input.required<Area[]>();

  protected readonly areasById =
    computed(() =>
      new Map(
        this.areas().map(
          area => [
            area.id,
            area
          ]
        )
      )
    );

  protected closeResultsAndFocusSearch(): void {
    this.search.closeResults();
    this.document.getElementById('global-search')?.focus();
  }
}
