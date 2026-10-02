import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

/**
 * Indicatore visuale utilizzato durante il caricamento asincrono dei contenuti.
 */
@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.html',
  styleUrl: './loading-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIndicator { }
