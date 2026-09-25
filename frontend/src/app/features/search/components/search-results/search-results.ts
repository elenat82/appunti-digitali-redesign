import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import { SearchService } from '../../services/search.service';

/**
 * Presenta lo stato e i risultati della ricerca globale.
 */
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResults {
  readonly search = inject(SearchService);
}
