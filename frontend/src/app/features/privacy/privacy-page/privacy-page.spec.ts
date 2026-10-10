import {
  provideHttpClient
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  PrivacyPage
} from './privacy-page';

describe('PrivacyPage', () => {
  let fixture:
    ComponentFixture<PrivacyPage>;

  let httpTesting:
    HttpTestingController;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          PrivacyPage
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      })
      .compileComponents();

    httpTesting =
      TestBed.inject(
        HttpTestingController
      );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  function createComponent(): void {
    fixture =
      TestBed.createComponent(
        PrivacyPage
      );

    fixture.detectChanges();
  }

  it(
    'carica e mostra il contenuto dell’informativa privacy',
    () => {
      createComponent();

      expect(
        fixture.nativeElement
          .textContent
      ).toContain(
        'Caricamento informativa...'
      );

      const request =
        httpTesting.expectOne(
          '/content/privacy-policy.html'
        );

      expect(
        request.request.method
      ).toBe('GET');

      expect(
        request.request.responseType
      ).toBe('text');

      request.flush(`
        <section>
          <h2>
            Contenuto provvisorio
          </h2>

          <p>
            Testo dell'informativa.
          </p>
        </section>
      `);

      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('h1')
          ?.textContent
      ).toContain(
        'Informativa privacy'
      );

      expect(
        fixture.nativeElement
          .querySelector(
            '.privacy-content h2'
          )
          ?.textContent
      ).toContain(
        'Contenuto provvisorio'
      );

      expect(
        fixture.nativeElement
          .querySelector(
            '.privacy-content p'
          )
          ?.textContent
      ).toContain(
        'Testo dell\'informativa.'
      );

      expect(
        document.title
      ).toBe(
        'Informativa privacy | Appunti Digitali'
      );
    }
  );

  it(
    'mostra un errore quando il file dell’informativa non può essere caricato',
    () => {
      createComponent();

      const request =
        httpTesting.expectOne(
          '/content/privacy-policy.html'
        );

      request.flush(
        'Errore',
        {
          status: 500,
          statusText:
            'Internal Server Error'
        }
      );

      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .textContent
      ).toContain(
        'Impossibile caricare l\'informativa privacy.'
      );

      expect(
        fixture.nativeElement
          .querySelector(
            '.privacy-content'
          )
      ).toBeNull();
    }
  );
});
