import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

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
  protected readonly search = inject(SearchService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly currentUrl =
    toSignal(
      this.router.events.pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        map(
          event => event.urlAfterRedirects
        )
      ),
      {
        initialValue: this.router.url
      }
    );

  protected readonly resultsButtonLabel =
    computed(() => {
      const urlTree =
        this.router.parseUrl(
          this.currentUrl()
        );

      const params =
        urlTree.queryParams;

      const isSearchOccurrence =
        params['source'] !== undefined &&
        params['start'] !== undefined &&
        params['end'] !== undefined;

      return isSearchOccurrence
        ? 'Torna ai risultati'
        : 'Mostra risultati';
    });

  protected openResults(): void {
    this.search.openResults();
    this.document.getElementById('global-search')?.focus();
  }
}
