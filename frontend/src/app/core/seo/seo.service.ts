import {
  DOCUMENT
} from '@angular/common';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  environment
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly document = inject(DOCUMENT);

  /**
   * Imposta il canonical URL della pagina corrente.
   *
   * Il path viene risolto rispetto all'URL pubblico del frontend, evitando che host di sviluppo o parametri della route diventino parte dell'URL canonico.
   */
  setCanonical(path: string): void {
    const href = new URL(
      path,
      environment.siteBaseUrl
    ).toString();

    let canonical =
      this.document
        .head
        .querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        );

    if (!canonical) {
      canonical =
        this.document.createElement('link');

      canonical.rel = 'canonical';

      this.document.head.appendChild(
        canonical
      );
    }

    canonical.href = href;
  }

  /**
   * Rimuove un canonical eventualmente lasciato dalla pagina precedente.
   */
  removeCanonical(): void {
    this.document
      .head
      .querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      )
      ?.remove();
  }
}
