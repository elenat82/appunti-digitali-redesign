import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

interface CodePenWindow extends Window {
  __CPEmbed?: (selector?: string) => void;

  IntersectionObserver?: typeof globalThis.IntersectionObserver;
}

const CODEPEN_SCRIPT_ID =
  'codepen-embed-script';

const CODEPEN_SCRIPT_SRC =
  'https://public.codepenassets.com/embed/index.js';

/**
 * Gestisce il progressive enhancement degli embed CodePen presenti nel body degli articoli.
 *
 * Il body renderizzato da Angular viene sanitizzato e perde gli attributi data-* utilizzati da CodePen. Il servizio ripristina
 * esclusivamente gli attributi CodePen previsti dal progetto, utilizzando come sorgente il markup originale ricevuto da Drupal.
 */
@Injectable({
  providedIn: 'root'
})
export class CodePenEmbedService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId =
    inject(PLATFORM_ID);

  private scriptPromise:
    Promise<void> | null = null;

  private demoIndex = 0;

  private observer:
    IntersectionObserver | null = null;

  /**
   * Prepara e inizializza gli embed CodePen presenti nel body.
   *
   * @param renderedBody Body già renderizzato e sanitizzato da Angular.
   * @param rawBodyHtml Markup originale ricevuto da Drupal.
   */
  enhance(
    renderedBody: HTMLElement,
    rawBodyHtml: string,
    area: string
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const renderedDemos = Array.from(
      renderedBody.querySelectorAll<HTMLElement>(
        '.codepen-demo'
      )
    );

    if (renderedDemos.length === 0) {
      return;
    }

    const window =
      this.document.defaultView;

    if (!window) {
      return;
    }

    const parser =
      new window.DOMParser();

    const rawDocument =
      parser.parseFromString(
        rawBodyHtml,
        'text/html'
      );

    const rawDemos = Array.from(
      rawDocument.querySelectorAll<HTMLElement>(
        '.codepen-demo'
      )
    );

    this.observer?.disconnect();
    this.observer = null;

    const demosToObserve: HTMLElement[] = [];

    renderedDemos.forEach(
      (renderedDemo, index) => {
        if (
          renderedDemo.dataset[
          'codepenInitialized'
          ] === 'true'
        ) {
          return;
        }

        const rawDemo = rawDemos[index];

        if (!rawDemo) {
          return;
        }

        if (
          renderedDemo.dataset[
          'codepenPrepared'
          ] !== 'true'
        ) {
          this.restoreCodePenAttributes(
            rawDemo,
            renderedDemo
          );

          renderedDemo.setAttribute(
            'data-height',
            '400'
          );

          renderedDemo.setAttribute(
            'data-editable',
            'true'
          );

          renderedDemo.setAttribute(
            'data-theme-id',
            'dark'
          );

          renderedDemo.setAttribute(
            'data-default-tab',
            this.getDefaultTab(area)
          );

          renderedDemo.dataset[
            'codepenPrepared'
          ] = 'true';

          renderedDemo.dataset[
            'codepenId'
          ] = `codepen-${++this.demoIndex}`;
        }

        demosToObserve.push(
          renderedDemo
        );
      }
    );

    this.observeDemos(demosToObserve);
  }

  /**
   * Osserva le demo e le inizializza quando si avvicinano alla viewport.
   */
  private observeDemos(
    demos: readonly HTMLElement[]
  ): void {
    if (demos.length === 0) {
      return;
    }

    const window =
      this.document.defaultView;

    if (!window) {
      return;
    }

    const IntersectionObserverConstructor =
      window.IntersectionObserver;

    if (!IntersectionObserverConstructor) {
      for (const demo of demos) {
        this.initializeDemo(demo);
      }

      return;
    }

    this.observer =
      new IntersectionObserverConstructor(
        (entries, observer) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }

            const demo =
              entry.target as HTMLElement;

            observer.unobserve(demo);

            this.initializeDemo(demo);
          }
        },
        {
          rootMargin: '600px 0px'
        }
      );

    for (const demo of demos) {
      this.observer.observe(demo);
    }
  }

  /**
   * Inizializza una singola demo CodePen.
   */
  private initializeDemo(
    demo: HTMLElement
  ): void {
    if (
      demo.dataset[
      'codepenInitialized'
      ] === 'true' ||
      demo.dataset[
      'codepenInitializing'
      ] === 'true'
    ) {
      return;
    }

    const id =
      demo.dataset['codepenId'];

    if (!id) {
      return;
    }

    demo.dataset[
      'codepenInitializing'
    ] = 'true';

    void this.loadScript()
      .then(() => {
        const codePenWindow = this.document.defaultView as CodePenWindow | null;

        codePenWindow?.__CPEmbed?.(
          `[data-codepen-id="${id}"]`
        );

        demo.dataset[
          'codepenInitialized'
        ] = 'true';

        delete demo.dataset[
          'codepenInitializing'
        ];
      })
      .catch(() => {
        delete demo.dataset[
          'codepenInitializing'
        ];

        delete demo.dataset[
          'codepenPrepared'
        ];
      });
  }

  /**
   * Ripristina gli attributi CodePen rimossi dal sanitizer Angular.
   */
  private restoreCodePenAttributes(
    rawDemo: HTMLElement,
    renderedDemo: HTMLElement
  ): void {
    const prefill =
      rawDemo.getAttribute(
        'data-prefill'
      );

    if (prefill !== null) {
      renderedDemo.setAttribute(
        'data-prefill',
        prefill
      );
    }

    const rawBlocks = Array.from(
      rawDemo.querySelectorAll<HTMLElement>(
        ':scope > pre'
      )
    );

    const renderedBlocks = Array.from(
      renderedDemo.querySelectorAll<HTMLElement>(
        ':scope > pre'
      )
    );

    renderedBlocks.forEach(
      (renderedBlock, index) => {
        const rawBlock =
          rawBlocks[index];

        if (!rawBlock) {
          return;
        }

        const language =
          rawBlock.getAttribute(
            'data-lang'
          );

        if (language !== null) {
          renderedBlock.setAttribute(
            'data-lang',
            language
          );
        }

        const autoprefixer =
          rawBlock.getAttribute(
            'data-options-autoprefixer'
          );

        if (autoprefixer !== null) {
          renderedBlock.setAttribute(
            'data-options-autoprefixer',
            autoprefixer
          );
        }
      }
    );
  }

  /**
   * Carica lo script CodePen una sola volta.
   */
  private loadScript(): Promise<void> {
    const window =
      this.document.defaultView as CodePenWindow | null;

    if (window?.__CPEmbed) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise =
      new Promise<void>(
        (resolve, reject) => {
          const existingScript =
            this.document
              .getElementById(
                CODEPEN_SCRIPT_ID
              ) as HTMLScriptElement | null;

          const script =
            existingScript ??
            this.document.createElement(
              'script'
            );

          const handleLoad = (): void => {
            resolve();
          };

          const handleError = (): void => {
            this.scriptPromise = null;

            if (!existingScript) {
              script.remove();
            }

            reject(
              new Error(
                'Impossibile caricare CodePen.'
              )
            );
          };

          script.addEventListener(
            'load',
            handleLoad,
            { once: true }
          );

          script.addEventListener(
            'error',
            handleError,
            { once: true }
          );

          if (!existingScript) {
            script.id =
              CODEPEN_SCRIPT_ID;

            script.src =
              CODEPEN_SCRIPT_SRC;

            script.async = true;

            this.document.head.appendChild(
              script
            );
          }
        }
      );

    return this.scriptPromise;
  }

  private getDefaultTab(
    area: string
  ): string {
    switch (area) {
      case 'html':
        return 'html,result';

      case 'css':
        return 'css,result';

      case 'javascript':
        return 'js,result';

      default:
        return 'result';
    }
  }

}
