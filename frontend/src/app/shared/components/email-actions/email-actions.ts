import {
  Component,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core';

const EMAIL_ACTIONS_CLOSE_DELAY_MS = 2000;
let nextEmailActionsId = 0;

@Component({
  selector: 'app-email-actions',
  templateUrl: './email-actions.html',
  styleUrl: './email-actions.scss'
})
export class EmailActions {
  readonly email = input.required<string>();

  readonly isEmailActionsOpen = signal(false);
  readonly emailCopyStatus = signal<'idle' | 'copied' | 'error'>('idle');
  private emailActionsCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly emailTrigger = viewChild<ElementRef<HTMLButtonElement>>('emailTrigger');
  private readonly actionsPanel = viewChild<ElementRef<HTMLElement>>('actionsPanel');

  /**
 * Identificatore univoco del pannello delle azioni email.
 *
 * È necessario perché il componente può essere presente più volte nella stessa pagina, ad esempio nella Home e nel footer.
 * L'id univoco evita duplicati nel DOM e permette al pulsante di riferirsi al pannello corretto tramite aria-controls.
 */
  readonly actionsId = `email-actions-${nextEmailActionsId++}`;

  toggleEmailActions(): void {
    if (this.emailActionsCloseTimeout) {
      clearTimeout(
        this.emailActionsCloseTimeout
      );

      this.emailActionsCloseTimeout = null;
    }

    this.isEmailActionsOpen.update(
      isOpen => !isOpen
    );

    this.emailCopyStatus.set('idle');
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(
        this.email()
      );

      this.emailCopyStatus.set('copied');
    }
    catch {
      this.emailCopyStatus.set('error');
    }

    this.scheduleEmailActionsClose();
  }

  /**
 * Programma la chiusura del pannello dopo un'azione dell'utente (ad esempio copia dell'indirizzo o apertura del client email).
 * Il ritardo permette di lasciare visibile il feedback dell'azione prima di rimuovere il pannello.
 */

  scheduleEmailActionsClose(): void {
  if (this.emailActionsCloseTimeout) {
    clearTimeout(
      this.emailActionsCloseTimeout
    );
  }

  this.emailActionsCloseTimeout =
    setTimeout(() => {
      this.hideEmailActions();

      this.emailActionsCloseTimeout = null;
    }, EMAIL_ACTIONS_CLOSE_DELAY_MS);
}

  /**
 * Chiude subito il pannello quando l'utente lo dismette esplicitamente, ad esempio premendo Escape.
 * Annulla anche un'eventuale chiusura ritardata già programmata, perché il pannello non deve più restare aperto.
 */
  closeEmailActions(): void {
  if (this.emailActionsCloseTimeout) {
    clearTimeout(
      this.emailActionsCloseTimeout
    );

    this.emailActionsCloseTimeout = null;
  }

  this.hideEmailActions();
}

  /**
 * Chiude il pannello e ripristina il focus sul trigger se il focus si trova ancora in una delle azioni email.
 */
private hideEmailActions(): void {
  const panel =
    this.actionsPanel()?.nativeElement;

  const shouldRestoreFocus =
    panel !== undefined &&
    document.activeElement !== null &&
    panel.contains(document.activeElement);

  this.isEmailActionsOpen.set(false);
  this.emailCopyStatus.set('idle');

  if (shouldRestoreFocus) {
    this.emailTrigger()
      ?.nativeElement
      .focus();
  }
}


}
