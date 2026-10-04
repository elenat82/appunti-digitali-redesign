import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { Area } from '../../../core/models/area.model';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  readonly areas = input.required<Area[]>();

  readonly articlesByArea = input.required<Record<string, Article[]>>();

  private readonly router = inject(Router);

  /**
   * Indica se il contenuto della sidebar è visibile.
   */
  readonly isOpen = signal(true);


  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd =>
          event instanceof NavigationEnd
      ),
      map((event) => event.urlAfterRedirects)
    ),
    {
      initialValue: this.router.url
    }
  );

  /**
   * Area tematica associata all'articolo corrente.
   */
  readonly activeAreaId = computed<string | null>(() => {
    const path =
      this.currentUrl().split(/[?#]/)[0];

    for (
      const [areaId, articles]
      of Object.entries(this.articlesByArea())
    ) {
      const containsCurrentArticle =
        articles.some(
          (article) => article.path === path
        );

      if (containsCurrentArticle) {
        return areaId;
      }
    }

    return null;
  });

  /**
   * Apre o chiude la sidebar e riproduce il relativo feedback sonoro.
   */
  toggle(): void {
    const willOpen = !this.isOpen();

    this.isOpen.set(willOpen);

    this.playToggleSound(willOpen);
  }

  /**
   * Riproduce il feedback sonoro associato all'apertura o alla chiusura della sidebar.
   */
  private playToggleSound(isOpening: boolean): void {
    const audio = new Audio(
      isOpening
        ? '/assets/sounds/sidebar-open.mp3'
        : '/assets/sounds/sidebar-close.mp3'
    );

    void audio.play().catch(() => {
      // Possiamo ignorare l'errore, il feedback sonoro è accessorio.
    });

  }
}
