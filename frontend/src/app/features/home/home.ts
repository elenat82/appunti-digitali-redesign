import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

/**
 * Pagina iniziale pubblica dell'applicazione.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {}
