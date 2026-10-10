import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';

import {
  CodePenConsentService
} from '../../../../core/privacy/codepen-consent.service';

import {
  CodePenEmbedService
} from '../../services/codepen-embed.service';

@Component({
  selector:
    'app-codepen-consent-prompt',
  templateUrl:
    './codepen-consent-prompt.html',
  styleUrl:
    './codepen-consent-prompt.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CodePenConsentPrompt {
  private readonly codePenConsent =
    inject(CodePenConsentService);

  private readonly codePenEmbed =
    inject(CodePenEmbedService);

  protected readonly isVisible =
    computed(
      () =>
        this.codePenEmbed
          .consentRequired() &&
        this.codePenConsent
          .status() === 'unknown'
    );

  protected accept(): void {
    this.codePenConsent.grant();
  }

  protected reject(): void {
    this.codePenConsent.deny();
  }
}
