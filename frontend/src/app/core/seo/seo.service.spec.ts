import {
  TestBed
} from '@angular/core/testing';

import {
  SeoService
} from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    document
      .head
      .querySelector(
        'link[rel="canonical"]'
      )
      ?.remove();

    TestBed.configureTestingModule({});

    service = TestBed.inject(
      SeoService
    );
  });

  afterEach(() => {
    document
      .head
      .querySelector(
        'link[rel="canonical"]'
      )
      ?.remove();
  });

  it('crea il canonical URL', () => {
    service.setCanonical(
      '/appunti/html/articolo-di-prova'
    );

    const canonical =
      document
        .head
        .querySelector<HTMLLinkElement>(
          'link[rel="canonical"]'
        );

    expect(canonical?.href).toBe(
      'https://www.appunti-digitali.it/appunti/html/articolo-di-prova'
    );
  });

  it('aggiorna il canonical esistente senza duplicarlo', () => {
    service.setCanonical('/');

    service.setCanonical(
      '/appunti/html/articolo-di-prova'
    );

    const canonicals =
      document
        .head
        .querySelectorAll(
          'link[rel="canonical"]'
        );

    expect(canonicals).toHaveLength(1);

    expect(
      (canonicals[0] as HTMLLinkElement).href
    ).toBe(
      'https://www.appunti-digitali.it/appunti/html/articolo-di-prova'
    );
  });

  it('imposta i metadata Open Graph', () => {
    service.setOpenGraph({
      type: 'article',
      title: 'Articolo di prova | Appunti Digitali',
      description: 'Descrizione di prova.',
      path: '/appunti/html/articolo-di-prova'
    });

    expect(
      document
        .head
        .querySelector<HTMLMetaElement>(
          'meta[property="og:type"]'
        )
        ?.content
    ).toBe('article');

    expect(
      document
        .head
        .querySelector<HTMLMetaElement>(
          'meta[property="og:title"]'
        )
        ?.content
    ).toBe(
      'Articolo di prova | Appunti Digitali'
    );

    expect(
      document
        .head
        .querySelector<HTMLMetaElement>(
          'meta[property="og:description"]'
        )
        ?.content
    ).toBe(
      'Descrizione di prova.'
    );

    expect(
      document
        .head
        .querySelector<HTMLMetaElement>(
          'meta[property="og:url"]'
        )
        ?.content
    ).toBe(
      'https://www.appunti-digitali.it/appunti/html/articolo-di-prova'
    );

    expect(
      document
        .head
        .querySelector<HTMLMetaElement>(
          'meta[property="og:site_name"]'
        )
        ?.content
    ).toBe(
      'Appunti Digitali'
    );
  });

  it('rimuove i metadata Open Graph', () => {
    service.setOpenGraph({
      type: 'article',
      title: 'Articolo di prova | Appunti Digitali',
      description: 'Descrizione di prova.',
      path: '/appunti/html/articolo-di-prova'
    });

    service.removeOpenGraph();

    expect(
      document.head.querySelector(
        'meta[property="og:type"]'
      )
    ).toBeNull();

    expect(
      document.head.querySelector(
        'meta[property="og:title"]'
      )
    ).toBeNull();

    expect(
      document.head.querySelector(
        'meta[property="og:description"]'
      )
    ).toBeNull();

    expect(
      document.head.querySelector(
        'meta[property="og:url"]'
      )
    ).toBeNull();

    expect(
      document.head.querySelector(
        'meta[property="og:site_name"]'
      )
    ).toBeNull();
  });
});
