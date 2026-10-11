import {
  TestBed
} from '@angular/core/testing';

import {
  ArticleBodyRenderingService
} from './article-body-rendering.service';

describe(
  'ArticleBodyRenderingService',
  () => {
    let service:
      ArticleBodyRenderingService;

    beforeEach(() => {
      TestBed.configureTestingModule({});

      service =
        TestBed.inject(
          ArticleBodyRenderingService
        );
    });

    it('rimuove gli attributi gestiti tramite progressive enhancement', () => {
      const body = `
          <span style="color:red">
            Rosso
          </span>

          <div
            class="codepen-demo"
            data-prefill
          >
            <pre
              data-lang="css"
              data-options-autoprefixer="true"
            >
              body {}
            </pre>
          </div>
        `;

      const result =
        service.prepareForRendering(
          body
        );

      expect(result)
        .not
        .toContain('style=');

      expect(result)
        .not
        .toContain('data-prefill');

      expect(result)
        .not
        .toContain('data-lang');

      expect(result)
        .not
        .toContain(
          'data-options-autoprefixer'
        );

      expect(result)
        .toContain(
          'class="codepen-demo"'
        );

      expect(result)
        .toContain('Rosso');

      expect(result)
        .toContain('body {}');
    });

    it('rimuove temporaneamente i data attribute ammessi', () => {
      const result =
        service.prepareForRendering(
          '<button data-toggle="modal">Apri</button>'
        );

      expect(result)
        .not
        .toContain(
          'data-toggle'
        );

      expect(result)
        .toContain('Apri');
    });

    it('rimuove i metadati interni Drupal', () => {
      const result =
        service.prepareForRendering(`
        <img
          src="/image.png"
          data-entity-type="file"
          data-entity-uuid="123"
          alt="Test"
        >
      `);

      expect(result)
        .not
        .toContain(
          'data-entity-type'
        );

      expect(result)
        .not
        .toContain(
          'data-entity-uuid'
        );

      expect(result)
        .toContain(
          'src="/image.png"'
        );
    });

    it('rimuove loading dalle immagini', () => {
      const result =
        service.prepareForRendering(`
        <img
          src="/image.png"
          alt="Test"
          loading="lazy"
        >
      `);

      expect(result)
        .not
        .toContain('loading=');

      expect(result)
        .toContain('src="/image.png"');

      expect(result)
        .toContain('alt="Test"');
    });
  }
);
