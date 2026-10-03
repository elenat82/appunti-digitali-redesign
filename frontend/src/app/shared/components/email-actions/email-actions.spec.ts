
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { EmailActions } from './email-actions';

describe('EmailActions', () => {

  let fixture: ComponentFixture<EmailActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailActions]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailActions);

    fixture.componentRef.setInput(
      'email',
      'elena@example.com'
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows email actions when the email is clicked', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    const emailButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email'
      );

    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeNull();

    emailButton?.click();
    fixture.detectChanges();

    const actions =
      element.querySelector<HTMLElement>(
        '.profile-email-actions'
      );

    expect(actions).toBeTruthy();

    expect(
      emailButton?.getAttribute(
        'aria-expanded'
      )
    ).toBe('true');

    expect(
      emailButton?.getAttribute(
        'aria-controls'
      )
    ).toBe(actions?.id);
  });

  it('provides a mailto action for the profile email', () => {

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const emailButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email'
      );

    emailButton?.click();
    fixture.detectChanges();

    const mailLink =
      element.querySelector<HTMLAnchorElement>(
        '.profile-email-actions a'
      );

    expect(mailLink?.getAttribute('href')).toBe(
      'mailto:elena@example.com'
    );
  });

  it('copies the profile email to the clipboard', async () => {
    vi.useFakeTimers();

    const writeText =
      vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(
      navigator,
      'clipboard',
      {
        configurable: true,
        value: {
          writeText
        }
      }
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const emailButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email'
      );

    emailButton?.click();
    fixture.detectChanges();

    const copyButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email-actions button'
      );

    copyButton?.click();

    await Promise.resolve();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith(
      'elena@example.com'
    );

    expect(
      copyButton?.textContent
    ).toContain('Copiato!');

    // Il pannello resta visibile per mostrare il feedback.
    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2000);
    fixture.detectChanges();

    // Dopo il ritardo il pannello viene chiuso.
    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeNull();

    expect(
      emailButton?.getAttribute(
        'aria-expanded'
      )
    ).toBe('false');
  });

  it('closes email actions immediately with Escape', () => {

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const emailButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email'
      );

    emailButton?.click();
    fixture.detectChanges();

    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeTruthy();

    emailButton?.dispatchEvent(
      new KeyboardEvent(
        'keydown',
        {
          key: 'Escape',
          bubbles: true
        }
      )
    );

    fixture.detectChanges();

    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeNull();

    expect(
      emailButton?.getAttribute(
        'aria-expanded'
      )
    ).toBe('false');
  });

  it('shows an error when the email cannot be copied', async () => {
    vi.useFakeTimers();

    const writeText =
      vi.fn().mockRejectedValue(
        new Error('Clipboard unavailable')
      );

    Object.defineProperty(
      navigator,
      'clipboard',
      {
        configurable: true,
        value: {
          writeText
        }
      }
    );

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    const emailButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email'
      );

    emailButton?.click();
    fixture.detectChanges();

    const copyButton =
      element.querySelector<HTMLButtonElement>(
        '.profile-email-actions button'
      );

    copyButton?.click();

    await Promise.resolve();
    fixture.detectChanges();

    expect(
      copyButton?.textContent
    ).toContain(
      'Copia non riuscita'
    );

    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2000);
    fixture.detectChanges();

    expect(
      element.querySelector(
        '.profile-email-actions'
      )
    ).toBeNull();
  });
});
