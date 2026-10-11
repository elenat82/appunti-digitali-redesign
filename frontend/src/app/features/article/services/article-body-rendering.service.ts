import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

const ALLOWED_STYLES: Record<
  string,
  Record<string, ReadonlySet<string>>
> = {
  span: {
    color: new Set([
      'aqua',
      'black',
      'blue',
      'fuchsia',
      'gray',
      'green',
      'lime',
      'maroon',
      'navy',
      'olive',
      'purple',
      'red',
      'silver',
      'teal',
      'white',
      'yellow'
    ]),
    'font-size': new Set([
      '1.5rem'
    ]),
    'font-weight': new Set([
      'inherit'
    ])
  },

  td: {
    cursor: new Set([
      'default',
      'none',
      'context-menu',
      'help',
      'pointer',
      'progress',
      'wait',
      'cell',
      'crosshair',
      'text',
      'vertical-text',
      'alias',
      'copy',
      'move',
      'no-drop',
      'not-allowed',
      'grab',
      'grabbing',
      'e-resize',
      'nesw-resize',
      'col-resize',
      'row-resize',
      'all-scroll',
      'zoom-in'
    ])
  },

  div: {
    width: new Set([
      '90%'
    ]),
    padding: new Set([
      '10px'
    ]),
    'background-color': new Set([
      'white'
    ]),
    border: new Set([
      '#cccccc thin dotted'
    ]),
    margin: new Set([
      'auto'
    ]),
    cursor: new Set([
      "url('/images/examples/zampina.png'), auto"
    ]),
  },

  caption: {
    'text-align': new Set([
      'center'
    ])
  },

  table: {
    width: new Set([
      '100%'
    ])
  }
};

const ALLOWED_DATA_ATTRIBUTES =
  new Set([
    'data-element',
    'data-spread',
    'data-display',
    'data-forecast-details',
    'data-forecast-toggle',
    'data-hide-label',
    'data-nome-modulo-forecast',
    'data-show-label',
    'data-drupal-selector',
    'data-backdrop-active',
    'data-src',
    'data-toggle',
    'data-link'
  ]);

@Injectable({
  providedIn: 'root'
})
export class ArticleBodyRenderingService {
  private readonly document =
    inject(DOCUMENT);

  private readonly platformId =
    inject(PLATFORM_ID);

  /**
   * Prepara il body per [innerHTML].
   *
   * Rimuove soltanto gli attributi che vengono ripristinati successivamente in modo controllato.
   * Angular applica comunque il proprio sanitizer al markup risultante.
   */
  prepareForRendering(
    rawBodyHtml: string
  ): string {
    const container =
      this.document.createElement('div');

    container.innerHTML =
      rawBodyHtml;

    container
      .querySelectorAll('[style]')
      .forEach((element) => {
        element.removeAttribute(
          'style'
        );
      });

    const attributesToRemove = [
      'data-prefill',
      'data-lang',
      'data-options-autoprefixer',

      // Metadati Drupal non necessari nel frontend.
      'data-entity-type',
      'data-entity-uuid',

      'loading',

      // Attributi delle demo ripristinati dopo il rendering.
      ...ALLOWED_DATA_ATTRIBUTES
    ];

    for (
      const attribute
      of attributesToRemove
    ) {
      container
        .querySelectorAll(
          `[${attribute}]`
        )
        .forEach((element) => {
          element.removeAttribute(
            attribute
          );
        });
    }

    return container.innerHTML;
  }

  /**
   * Ripristina esclusivamente gli inline style
   * censiti e ammessi dal progetto.
   */
  restoreAllowedStyles(
    renderedBody: HTMLElement,
    rawBodyHtml: string
  ): void {
    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    const rawContainer =
      this.document.createElement('div');

    rawContainer.innerHTML =
      rawBodyHtml;

    for (
      const [
        tagName,
        allowedProperties
      ] of Object.entries(
        ALLOWED_STYLES
      )
    ) {
      const rawElements =
        Array.from(
          rawContainer
            .querySelectorAll<HTMLElement>(
              tagName
            )
        );

      const renderedElements =
        Array.from(
          renderedBody
            .querySelectorAll<HTMLElement>(
              tagName
            )
        );

      rawElements.forEach(
        (rawElement, index) => {
          const rawStyle =
            rawElement.getAttribute(
              'style'
            );

          const renderedElement =
            renderedElements[index];

          if (
            !rawStyle ||
            !renderedElement
          ) {
            return;
          }

          this.restoreStyleDeclarations(
            renderedElement,
            rawStyle,
            allowedProperties
          );
        }
      );
    }
  }

  private restoreStyleDeclarations(
    element: HTMLElement,
    rawStyle: string,
    allowedProperties:
      Record<
        string,
        ReadonlySet<string>
      >
  ): void {
    const declarations =
      rawStyle.split(';');

    for (
      const declaration
      of declarations
    ) {
      const separatorIndex =
        declaration.indexOf(':');

      if (separatorIndex < 0) {
        continue;
      }

      const property =
        declaration
          .slice(
            0,
            separatorIndex
          )
          .trim()
          .toLowerCase();

      const value =
        declaration
          .slice(
            separatorIndex + 1
          )
          .trim()
          .toLowerCase();

      const allowedValues =
        allowedProperties[property];

      if (
        !allowedValues ||
        !allowedValues.has(value)
      ) {
        continue;
      }

      element.style.setProperty(
        property,
        value
      );
    }
  }

  /**
 * Ripristina gli attributi data-* ammessi utilizzati dalle demo degli articoli.
 */
  restoreAllowedDataAttributes(
    renderedBody: HTMLElement,
    rawBodyHtml: string
  ): void {
    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    const rawContainer =
      this.document.createElement(
        'div'
      );

    rawContainer.innerHTML =
      rawBodyHtml;

    for (
      const attribute
      of ALLOWED_DATA_ATTRIBUTES
    ) {
      const rawElements =
        Array.from(
          rawContainer
            .querySelectorAll<HTMLElement>(
              `[${attribute}]`
            )
        );

      for (
        const rawElement
        of rawElements
      ) {
        const value =
          rawElement.getAttribute(
            attribute
          );

        if (value === null) {
          continue;
        }

        const tagName =
          rawElement.tagName
            .toLowerCase();

        const rawElementsOfTag =
          Array.from(
            rawContainer
              .querySelectorAll(
                tagName
              )
          );

        const index =
          rawElementsOfTag.indexOf(
            rawElement
          );

        if (index < 0) {
          continue;
        }

        const renderedElement =
          renderedBody
            .querySelectorAll<HTMLElement>(
              tagName
            )[index];

        if (!renderedElement) {
          continue;
        }

        renderedElement.setAttribute(
          attribute,
          value
        );
      }
    }
  }
}
