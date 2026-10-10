import {
  PLATFORM_ID
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  CodePenConsentService
} from './codepen-consent.service';

describe(
  'CodePenConsentService',
  () => {
    beforeEach(() => {
      localStorage.clear();

      TestBed.configureTestingModule({
        providers: [
          CodePenConsentService,
          {
            provide: PLATFORM_ID,
            useValue: 'browser'
          }
        ]
      });
    });

    afterEach(() => {
      localStorage.clear();
    });

    it(
      'parte senza una preferenza CodePen',
      () => {
        const service =
          TestBed.inject(
            CodePenConsentService
          );

        expect(
          service.status()
        ).toBe('unknown');
      }
    );

    it(
      'memorizza il consenso a CodePen',
      () => {
        const service =
          TestBed.inject(
            CodePenConsentService
          );

        service.grant();

        expect(
          service.status()
        ).toBe('granted');

        expect(
          localStorage.getItem(
            'appunti-digitali-codepen-consent'
          )
        ).toContain(
          '"status":"granted"'
        );
      }
    );

    it(
      'memorizza il rifiuto di CodePen',
      () => {
        const service =
          TestBed.inject(
            CodePenConsentService
          );

        service.deny();

        expect(
          service.status()
        ).toBe('denied');
      }
    );

    it(
      'ripristina una preferenza già salvata',
      () => {
        localStorage.setItem(
          'appunti-digitali-codepen-consent',
          JSON.stringify({
            status: 'granted',
            version: 1
          })
        );

        const service =
          TestBed.inject(
            CodePenConsentService
          );

        expect(
          service.status()
        ).toBe('granted');
      }
    );

    it(
      'resetta la preferenza',
      () => {
        const service =
          TestBed.inject(
            CodePenConsentService
          );

        service.grant();
        service.reset();

        expect(
          service.status()
        ).toBe('unknown');

        expect(
          localStorage.getItem(
            'appunti-digitali-codepen-consent'
          )
        ).toBeNull();
      }
    );
  }
);
