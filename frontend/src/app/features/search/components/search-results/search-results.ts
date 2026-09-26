import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchService } from '../../services/search.service';

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
}
