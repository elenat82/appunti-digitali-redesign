import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

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

  readonly articlesByArea =
    input.required<Record<string, Article[]>>();

  /**
   * Indica se il contenuto della sidebar è visibile.
   */
  readonly isOpen = signal(true);

  /**
   * Apre o chiude la sidebar.
   */
  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
