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
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { Area } from '../../../core/models/area.model';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
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

  /**
 * Path dell'articolo attualmente visualizzato.
 *
 * Query string e fragment non fanno parte dell'identità dell'articolo e vengono ignorati.
 */
  readonly activeArticlePath = computed(() =>
    this.currentUrl().split(/[?#]/)[0]
  );


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
    const path = this.activeArticlePath();

    for (
      const [areaId, articles]
      of Object.entries(this.articlesByArea())
    ) {
      if (
        articles.some(
          (article) => article.path === path
        )
      ) {
        return areaId;
      }
    }

    return null;
  });

  /**
   * Apre o chiude la sidebar e riproduce il relativo feedback sonoro.
   */
  toggle(): void {
    this.setOpen(!this.isOpen());
  }

  /**
 * Riapre la sidebar quando viene selezionata un'area mentre il pannello è collassato.
 */
  openAreaIfCollapsed(
    event: MouseEvent,
    details: HTMLDetailsElement
  ): void {
    if (this.isOpen()) {
      return;
    }

    /*
     * Impedisce al comportamento nativo del summary di invertire lo stato del details.
     *
     * Nello stato collassato vogliamo sempre:
     * - riaprire la sidebar;
     * - mostrare l'area selezionata già espansa.
     */
    event.preventDefault();

    details.open = true;

    this.setOpen(true);
  }

  /**
   * Imposta lo stato della sidebar e riproduce il feedback sonoro solo quando lo stato cambia.
   */
  private setOpen(isOpen: boolean): void {
    if (this.isOpen() === isOpen) {
      return;
    }

    this.isOpen.set(isOpen);

    this.playToggleSound(isOpen);
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
