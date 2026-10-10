import {
  signal
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  vi
} from 'vitest';

import {
  CodePenConsentService,
  CodePenConsentStatus
} from '../../../../core/privacy/codepen-consent.service';

import {
  CodePenEmbedService
} from '../../services/codepen-embed.service';

import {
  CodePenConsentPrompt
} from './codepen-consent-prompt';

describe(
  'CodePenConsentPrompt',
  () => {
    let fixture:
      ComponentFixture<
        CodePenConsentPrompt
      >;

    const consentRequired =
      signal(false);

    const consentStatus =
      signal<CodePenConsentStatus>(
        'unknown'
      );

    const grant = vi.fn();

    const deny = vi.fn();

    beforeEach(async () => {
      vi.clearAllMocks();

      consentRequired.set(false);
      consentStatus.set('unknown');

      await TestBed
        .configureTestingModule({
          imports: [
            CodePenConsentPrompt
          ],
          providers: [
            {
              provide:
                CodePenEmbedService,
              useValue: {
                consentRequired:
                  consentRequired
                    .asReadonly()
              }
            },
            {
              provide:
                CodePenConsentService,
              useValue: {
                status:
                  consentStatus
                    .asReadonly(),
                grant,
                deny
              }
            }
          ]
        })
        .compileComponents();

      fixture =
        TestBed.createComponent(
          CodePenConsentPrompt
        );

      fixture.detectChanges();
    });

    it(
      'non mostra il prompt quando non serve il consenso',
      () => {
        expect(
          fixture.nativeElement
            .querySelector(
              '.codepen-consent'
            )
        ).toBeNull();
      }
    );

    it(
      'mostra il prompt quando un CodePen richiede una scelta',
      () => {
        consentRequired.set(true);

        fixture.detectChanges();

        expect(
          fixture.nativeElement
            .textContent
        ).toContain(
          'Contenuti interattivi CodePen'
        );
      }
    );

    it(
      'concede il consenso',
      () => {
        consentRequired.set(true);

        fixture.detectChanges();

        const button:
          HTMLButtonElement =
          fixture.nativeElement
            .querySelector(
              '.codepen-consent__button--accept'
            );

        button.click();

        expect(
          grant
        ).toHaveBeenCalledOnce();
      }
    );

    it(
      'rifiuta il consenso',
      () => {
        consentRequired.set(true);

        fixture.detectChanges();

        const button:
          HTMLButtonElement =
          fixture.nativeElement
            .querySelector(
              '.codepen-consent__button--reject'
            );

        button.click();

        expect(
          deny
        ).toHaveBeenCalledOnce();
      }
    );

    it(
      'non ripropone il prompt dopo una scelta',
      () => {
        consentRequired.set(true);
        consentStatus.set(
          'denied'
        );

        fixture.detectChanges();

        expect(
          fixture.nativeElement
            .querySelector(
              '.codepen-consent'
            )
        ).toBeNull();
      }
    );
  }
);
