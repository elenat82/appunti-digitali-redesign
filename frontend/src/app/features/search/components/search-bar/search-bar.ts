import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { SearchService } from '../../services/search.service';

/**
 * Campo di ricerca globale dell'applicazione.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBar {
  readonly search = inject(SearchService);

  /**
   * Aggiorna la query condivisa della ricerca.
   *
   * @param event Evento generato dal campo di ricerca.
   */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.search.setQuery(input.value);
  }
}
