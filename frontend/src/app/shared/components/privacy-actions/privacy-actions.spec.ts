import {
  signal
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  provideRouter
} from '@angular/router';

import {
  vi
} from 'vitest';

import {
  CodePenConsentService,
  CodePenConsentStatus
} from '../../../core/privacy/codepen-consent.service';

import {
  PrivacyActions
} from './privacy-actions';

describe('PrivacyActions', () => {
  let fixture:
    ComponentFixture<PrivacyActions>;

  const consentStatus =
    signal<CodePenConsentStatus>(
      'unknown'
    );

  const grant =
    vi.fn();

  const deny =
    vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    consentStatus.set(
      'unknown'
    );

    await TestBed
      .configureTestingModule({
        imports: [
          PrivacyActions
        ],
        providers: [
          provideRouter([]),
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
        PrivacyActions
      );

    fixture.detectChanges();
  });

  function openPanel(): void {
    const element: HTMLElement =
      fixture.nativeElement;
    const trigger =
      element.querySelector<HTMLButtonElement>(
        '.privacy-trigger'
      );

    trigger?.click();

    fixture.detectChanges();
  }

  it(
    'apre il pannello privacy',
    () => {
      openPanel();

      expect(
        fixture.nativeElement
          .querySelector(
            '.privacy-actions'
          )
      ).toBeTruthy();

      expect(
        fixture.nativeElement
          .textContent
      ).toContain(
        'Informativa privacy'
      );
    }
  );

  it(
    'consente CodePen',
    () => {
      openPanel();

      const element: HTMLElement =
        fixture.nativeElement;

      const buttons =
        element.querySelectorAll<HTMLButtonElement>(
          '.privacy-action'
        );

      const consentButton =
        Array.from(buttons)
          .find(
            button =>
              button.textContent
                ?.includes(
                  'Consenti CodePen'
                )
          );

      consentButton?.click();

      expect(
        grant
      ).toHaveBeenCalledOnce();
    }
  );

  it(
    'permette di disabilitare CodePen quando è consentito',
    () => {
      consentStatus.set(
        'granted'
      );

      openPanel();

      expect(
        fixture.nativeElement
          .textContent
      ).toContain(
        'Contenuti CodePen consentiti.'
      );

      const element: HTMLElement =
        fixture.nativeElement;

      const button =
        Array
          .from(
            element.querySelectorAll<HTMLButtonElement>(
              '.privacy-action'
            )
          )
          .find(
            item =>
              item.textContent
                ?.includes(
                  'Disabilita CodePen'
                )
          );

      button?.click();

      expect(
        deny
      ).toHaveBeenCalledOnce();
    }
  );
});
