import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  SearchBar
} from '../../features/search/components/search-bar/search-bar';
import {
  SearchService
} from '../../features/search/services/search.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    SearchBar
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  protected readonly search =
    inject(SearchService);
}
