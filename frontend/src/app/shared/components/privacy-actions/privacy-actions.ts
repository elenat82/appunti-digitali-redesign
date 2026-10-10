import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  CodePenConsentService
} from '../../../core/privacy/codepen-consent.service';

let nextPrivacyActionsId = 0;

@Component({
  selector: 'app-privacy-actions',
  imports: [
    RouterLink
  ],
  templateUrl:
    './privacy-actions.html',
  styleUrl:
    './privacy-actions.scss'
})
export class PrivacyActions {
  private readonly codePenConsent =
    inject(CodePenConsentService);

  readonly isOpen =
    signal(false);

  readonly consentStatus =
    this.codePenConsent.status;

  private readonly trigger =
    viewChild<
      ElementRef<HTMLButtonElement>
    >('privacyTrigger');

  private readonly panel =
    viewChild<
      ElementRef<HTMLElement>
    >('privacyPanel');

  readonly actionsId =
    `privacy-actions-${nextPrivacyActionsId++}`;

  toggle(): void {
    this.isOpen.update(
      isOpen => !isOpen
    );
  }

  close(): void {
    this.hide();
  }

  grantCodePen(): void {
    this.codePenConsent.grant();
    this.hide();
  }

  denyCodePen(): void {
    this.codePenConsent.deny();
    this.hide();
  }

  private hide(): void {
    const panel =
      this.panel()?.nativeElement;

    const shouldRestoreFocus =
      panel !== undefined &&
      document.activeElement !== null &&
      panel.contains(
        document.activeElement
      );

    this.isOpen.set(false);

    if (shouldRestoreFocus) {
      this.trigger()
        ?.nativeElement
        .focus();
    }
  }
}
