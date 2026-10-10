import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

export type CodePenConsentStatus =
  'unknown' |
  'granted' |
  'denied';

interface StoredCodePenConsent {
  status: Exclude<
    CodePenConsentStatus,
    'unknown'
  >;
  version: number;
}

const STORAGE_KEY =
  'appunti-digitali-codepen-consent';

const CONSENT_VERSION = 1;

@Injectable({
  providedIn: 'root'
})
export class CodePenConsentService {
  private readonly platformId =
    inject(PLATFORM_ID);

  private readonly statusState =
    signal<CodePenConsentStatus>(
      this.readStoredConsent()
    );

  readonly status =
    this.statusState.asReadonly();

  grant(): void {
    this.setConsent('granted');
  }

  deny(): void {
    this.setConsent('denied');
  }

  reset(): void {
    this.statusState.set('unknown');

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
  }

  private setConsent(
    status: 'granted' | 'denied'
  ): void {
    this.statusState.set(status);

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    const value:
      StoredCodePenConsent = {
      status,
      version: CONSENT_VERSION
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value)
    );
  }

  private readStoredConsent():
    CodePenConsentStatus {
    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return 'unknown';
    }

    try {
      const rawValue =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!rawValue) {
        return 'unknown';
      }

      const value =
        JSON.parse(
          rawValue
        ) as Partial<
          StoredCodePenConsent
        >;

      if (
        value.version !==
        CONSENT_VERSION ||
        (
          value.status !==
          'granted' &&
          value.status !==
          'denied'
        )
      ) {
        return 'unknown';
      }

      return value.status;
    }
    catch {
      return 'unknown';
    }
  }
}
