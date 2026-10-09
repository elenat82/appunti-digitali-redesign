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
});
