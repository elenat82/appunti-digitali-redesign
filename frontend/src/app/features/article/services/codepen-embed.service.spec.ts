import {
  DOCUMENT
} from '@angular/common';
import {
  PLATFORM_ID, signal, WritableSignal
} from '@angular/core';
import {
  TestBed
} from '@angular/core/testing';

import {
  CodePenConsentService,
  CodePenConsentStatus
} from '../../../core/privacy/codepen-consent.service';

import {
  CodePenEmbedService
} from './codepen-embed.service';

interface CodePenWindow extends Window {
  __CPEmbed?: (selector?: string) => void;

  IntersectionObserver?: typeof globalThis.IntersectionObserver;
}

describe('CodePenEmbedService', () => {
  let service: CodePenEmbedService;
  let document: Document;
  let codePenWindow: CodePenWindow;
  let consentStatus: WritableSignal<CodePenConsentStatus>;
  const grantConsent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    consentStatus = signal<CodePenConsentStatus>('granted');

    TestBed.configureTestingModule({
      providers: [
        CodePenEmbedService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        },
        {
          provide: CodePenConsentService,
          useValue: {
            status:
              consentStatus.asReadonly(),
            grant:
              grantConsent
          }
        }
      ]
    });

    service =
      TestBed.inject(
        CodePenEmbedService
      );

    document =
      TestBed.inject(DOCUMENT);

    codePenWindow = document.defaultView as CodePenWindow;

    codePenWindow.__CPEmbed =
      vi.fn();
  });

  afterEach(() => {
    delete codePenWindow.__CPEmbed;
  });

  it('ripristina gli attributi CodePen rimossi dal sanitizer', async () => {
    const body =
      document.createElement('div');

    body.innerHTML = `
        <div class="codepen-demo">
          <pre>body { display: flex; }</pre>
        </div>
      `;

    const rawBody = `
        <div
          class="codepen-demo"
          data-prefill
        >
          <pre
            data-lang="css"
            data-options-autoprefixer="true"
          >body { display: flex; }</pre>
        </div>
      `;

    service.enhance(
      body,
      rawBody,
      'css'
    );

    await Promise.resolve();

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    const pre =
      demo?.querySelector('pre');

    expect(
      demo?.hasAttribute(
        'data-prefill'
      )
    ).toBe(true);

    expect(
      demo?.getAttribute(
        'data-height'
      )
    ).toBe('400');

    expect(
      demo?.getAttribute(
        'data-editable'
      )
    ).toBe('true');

    expect(
      pre?.getAttribute(
        'data-lang'
      )
    ).toBe('css');

    expect(
      pre?.getAttribute(
        'data-options-autoprefixer'
      )
    ).toBe('true');

    expect(
      demo?.getAttribute(
        'data-theme-id'
      )
    ).toBe('dark');

    expect(
      demo?.getAttribute(
        'data-default-tab'
      )
    ).toBe('css,result');

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledOnce();

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledWith(
      '[data-codepen-id="codepen-1"]'
    );
  });

  it('non inizializza CodePen quando il body non contiene embed', async () => {
    const body =
      document.createElement('div');

    body.innerHTML =
      '<p>Testo normale</p>';

    service.enhance(
      body,
      '<p>Testo normale</p>',
      'html'
    );

    await Promise.resolve();

    expect(
      codePenWindow.__CPEmbed
    ).not.toHaveBeenCalled();
  });

  it('non inizializza due volte lo stesso embed', async () => {
    const body =
      document.createElement('div');

    body.innerHTML = `
        <div class="codepen-demo">
          <pre>test</pre>
        </div>
      `;

    const rawBody = `
        <div
          class="codepen-demo"
          data-prefill
        >
          <pre data-lang="html">
            test
          </pre>
        </div>
      `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledOnce();
  });

  it('inizializza il CodePen solo quando si avvicina alla viewport', async () => {
    let callback!: IntersectionObserverCallback;
    let observerInstance!: IntersectionObserver;

    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();

    class IntersectionObserverMock {
      readonly root: Element | Document | null = null;

      readonly rootMargin = '600px 0px';

      readonly thresholds = [0];

      constructor(
        observerCallback:
          IntersectionObserverCallback,
        _options?: IntersectionObserverInit
      ) {
        callback = observerCallback;

        observerInstance =
          this as unknown as IntersectionObserver;
      }

      observe = observe;

      unobserve = unobserve;

      disconnect = disconnect;

      takeRecords():
        IntersectionObserverEntry[] {
        return [];
      }
    }

    const originalIntersectionObserver =
      codePenWindow.IntersectionObserver;

    Object.defineProperty(
      codePenWindow,
      'IntersectionObserver',
      {
        configurable: true,
        value: IntersectionObserverMock
      }
    );

    const body =
      document.createElement('div');

    body.innerHTML = `
      <div class="codepen-demo">
        <pre>test</pre>
      </div>
    `;

    const rawBody = `
      <div
        class="codepen-demo"
        data-prefill
      >
        <pre data-lang="html">
          test
        </pre>
      </div>
    `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    expect(demo).toBeTruthy();

    if (!demo) {
      return;
    }

    expect(observe).toHaveBeenCalledWith(
      demo
    );

    expect(
      codePenWindow.__CPEmbed
    ).not.toHaveBeenCalled();

    callback(
      [
        {
          time: 0,
          target: demo,
          rootBounds: null,
          boundingClientRect:
            demo.getBoundingClientRect(),
          intersectionRect:
            demo.getBoundingClientRect(),
          isIntersecting: true,
          intersectionRatio: 1
        } satisfies IntersectionObserverEntry
      ],
      observerInstance
    );

    await Promise.resolve();

    expect(
      unobserve
    ).toHaveBeenCalledWith(
      demo
    );

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledWith(
      '[data-codepen-id="codepen-1"]'
    );

    Object.defineProperty(
      codePenWindow,
      'IntersectionObserver',
      {
        configurable: true,
        value: originalIntersectionObserver
      }
    );
  });

  it.each([
    ['html', 'html,result'],
    ['css', 'css,result'],
    ['javascript', 'js,result'],
    ['varie', 'result']
  ])('usa il tab iniziale corretto per l\'area %s', (area, expectedTab) => {
    const body =
      document.createElement('div');

    body.innerHTML = `
      <div class="codepen-demo">
        <pre>test</pre>
      </div>
    `;

    const rawBody = `
      <div
        class="codepen-demo"
        data-prefill
      >
        <pre data-lang="html">
          test
        </pre>
      </div>
    `;

    service.enhance(
      body,
      rawBody,
      area
    );

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    expect(
      demo?.getAttribute(
        'data-default-tab'
      )
    ).toBe(expectedTab);
  });

  it.each([
    'unknown',
    'denied'
  ] as const)(
    'non inizializza CodePen quando il consenso è %s',
    async (status) => {
      consentStatus.set(status);

      const body =
        document.createElement('div');

      body.innerHTML = `
      <div class="codepen-demo">
        <pre>test</pre>
      </div>
    `;

      const rawBody = `
      <div
        class="codepen-demo"
        data-prefill
      >
        <pre data-lang="html">
          test
        </pre>
      </div>
    `;

      service.enhance(
        body,
        rawBody,
        'html'
      );

      await Promise.resolve();

      expect(
        codePenWindow.__CPEmbed
      ).not.toHaveBeenCalled();
    }
  );

  it('inizializza CodePen dopo che il consenso viene concesso', async () => {
    consentStatus.set('unknown');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    expect(
      codePenWindow.__CPEmbed
    ).not.toHaveBeenCalled();

    consentStatus.set('granted');

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledOnce();
  });

  it('richiede il consenso quando trova un CodePen e la scelta è unknown', () => {
    consentStatus.set('unknown');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    expect(
      service.consentRequired()
    ).toBe(true);
  });

  it('non richiede nuovamente il consenso quando CodePen è stato rifiutato', () => {
    consentStatus.set('denied');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    expect(
      service.consentRequired()
    ).toBe(false);

    expect(
      codePenWindow.__CPEmbed
    ).not.toHaveBeenCalled();
  });

  it('rimuove la richiesta di consenso quando il body non contiene CodePen', () => {
    consentStatus.set('unknown');

    const codePenBody =
      document.createElement('div');

    codePenBody.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawCodePenBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      codePenBody,
      rawCodePenBody,
      'html'
    );

    expect(
      service.consentRequired()
    ).toBe(true);

    const plainBody =
      document.createElement('div');

    plainBody.innerHTML =
      '<p>Nessun CodePen.</p>';

    service.enhance(
      plainBody,
      '<p>Nessun CodePen.</p>',
      'html'
    );

    expect(
      service.consentRequired()
    ).toBe(false);
  });

  it('nasconde il markup CodePen quando il consenso è negato', () => {
    consentStatus.set('denied');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    expect(
      demo?.hidden
    ).toBe(true);

    expect(
      codePenWindow.__CPEmbed
    ).not.toHaveBeenCalled();
  });

  it('rende visibile il CodePen quando viene concesso il consenso', async () => {
    consentStatus.set('unknown');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    expect(
      demo?.hidden
    ).toBe(true);

    consentStatus.set('granted');

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    expect(
      demo?.hidden
    ).toBe(false);

    expect(
      codePenWindow.__CPEmbed
    ).toHaveBeenCalledOnce();
  });

  it('mostra un placeholder quando il consenso a CodePen è negato', () => {
    consentStatus.set('denied');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    const demo =
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      );

    const placeholder =
      body.querySelector<HTMLElement>(
        '.codepen-consent-placeholder'
      );

    expect(
      demo?.hidden
    ).toBe(true);

    expect(
      placeholder
    ).toBeTruthy();

    expect(
      placeholder?.textContent
    ).toContain(
      'Demo CodePen non caricata.'
    );

    expect(
      placeholder?.textContent
    ).toContain(
      'Consenti CodePen'
    );
  });

  it('consente CodePen dal placeholder', () => {
    consentStatus.set('denied');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    const button =
      body.querySelector<HTMLButtonElement>(
        '.codepen-consent-placeholder__button'
      );

    expect(button).toBeTruthy();

    button?.click();

    expect(
      grantConsent
    ).toHaveBeenCalledOnce();
  });

  it('rimuove il placeholder quando CodePen viene autorizzato', async () => {
    consentStatus.set('denied');

    const body =
      document.createElement('div');

    body.innerHTML = `
    <div class="codepen-demo">
      <pre>test</pre>
    </div>
  `;

    const rawBody = `
    <div
      class="codepen-demo"
      data-prefill
    >
      <pre data-lang="html">
        test
      </pre>
    </div>
  `;

    service.enhance(
      body,
      rawBody,
      'html'
    );

    expect(
      body.querySelector(
        '.codepen-consent-placeholder'
      )
    ).toBeTruthy();

    consentStatus.set(
      'granted'
    );

    service.enhance(
      body,
      rawBody,
      'html'
    );

    await Promise.resolve();

    expect(
      body.querySelector(
        '.codepen-consent-placeholder'
      )
    ).toBeNull();

    expect(
      body.querySelector<HTMLElement>(
        '.codepen-demo'
      )?.hidden
    ).toBe(false);
  });

});
