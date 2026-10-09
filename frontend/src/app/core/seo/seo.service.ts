import {
  DOCUMENT
} from '@angular/common';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  Meta
} from '@angular/platform-browser';

import {
  environment
} from '../../../environments/environment';

interface OpenGraphMetadata {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);

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

  /**
 * Imposta i metadata Open Graph della pagina corrente.
 */
  setOpenGraph(
    metadata: OpenGraphMetadata
  ): void {
    const url = new URL(
      metadata.path,
      environment.siteBaseUrl
    ).toString();

    this.meta.updateTag(
      {
        property: 'og:type',
        content: metadata.type
      },
      'property="og:type"'
    );

    this.meta.updateTag(
      {
        property: 'og:title',
        content: metadata.title
      },
      'property="og:title"'
    );

    this.meta.updateTag(
      {
        property: 'og:description',
        content: metadata.description
      },
      'property="og:description"'
    );

    this.meta.updateTag(
      {
        property: 'og:url',
        content: url
      },
      'property="og:url"'
    );

    this.meta.updateTag(
      {
        property: 'og:site_name',
        content: 'Appunti Digitali'
      },
      'property="og:site_name"'
    );
  }

  /**
 * Rimuove i metadata Open Graph eventualmente lasciati dalla pagina precedente.
 */
  removeOpenGraph(): void {
    const properties = [
      'og:type',
      'og:title',
      'og:description',
      'og:url',
      'og:site_name'
    ];

    for (const property of properties) {
      this.meta.removeTag(
        `property="${property}"`
      );
    }
  }
}
