import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';

import { Meta, Title } from '@angular/platform-browser';

import Prism from 'prismjs';

import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-twig';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/show-language/prism-show-language';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/match-braces/prism-match-braces';

import { Article } from '../../../core/models/article.model';
import { ContentRepositoryService } from '../../../core/data-access/content-repository.service';
import {
  getSearchableBodyElements
} from '../../search/utils/article-search-dom';
import { SearchResultOccurrence } from '../../search/models/search-result.model';
import { SearchService } from '../../search/services/search.service';
import { CodePenEmbedService } from '../services/codepen-embed.service';
import {
  SeoService
} from '../../../core/seo/seo.service';

interface ArticlePageState {
  status: 'loading' | 'ready' | 'not-found' | 'error';
  article: Article | null;
}

/**
 * Pagina pubblica di un singolo articolo tecnico.
 */
@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contentRepository = inject(ContentRepositoryService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly search = inject(SearchService);
  private readonly codePenEmbed = inject(CodePenEmbedService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly seo = inject(SeoService);

  private readonly queryParamMap = toSignal(
    this.route.queryParamMap,
    {
      initialValue: this.route.snapshot.queryParamMap
    }
  );

  constructor() {

    effect(() => {
      const state = this.state();

      if (
        state.status === 'ready' &&
        state.article
      ) {
        const pageTitle =
          `${state.article.title} | Appunti Digitali`;

        this.title.setTitle(
          pageTitle
        );

        this.meta.updateTag({
          name: 'description',
          content: state.article.description
        });

        this.seo.setCanonical(
          state.article.path
        );

        this.seo.setOpenGraph({
          type: 'article',
          title: pageTitle,
          description: state.article.description,
          path: state.article.path
        });

        return;
      }

      // Rimuove i metadata della pagina precedente quando la route non dispone più di un articolo valido.
      this.meta.removeTag(
        'name="description"'
      );

      this.seo.removeCanonical();
      this.seo.removeOpenGraph();
    });

    // Applica highlight e scroll solo dopo che l'articolo è stato renderizzato e i segmenti sono disponibili nel DOM.
    afterRenderEffect({
      mixedReadWrite: () => {
        if (this.state().status !== 'ready') {
          return;
        }

        const article = this.state().article;

        if (!article) {
          return;
        }

        this.highlightCode();

        this.enhanceCodePen(article.body, article.area);

        const params = this.queryParamMap();

        const source = params.get('source');
        const indexParam = params.get('index');
        const startParam = params.get('start');
        const endParam = params.get('end');

        const index =
          indexParam === null
            ? undefined
            : Number.parseInt(indexParam, 10);

        const start =
          startParam === null
            ? undefined
            : Number.parseInt(startParam, 10);

        const end =
          endParam === null
            ? undefined
            : Number.parseInt(endParam, 10);

        if (
          !source ||
          start === undefined ||
          end === undefined ||
          Number.isNaN(start) ||
          Number.isNaN(end)
        ) {
          this.clearSearchHighlights();
          return;
        }

        const group = this.search.resultGroups().find(
          (group) => group.articleId === article.id
        );

        if (!group) {
          this.clearSearchHighlights();
          return;
        }

        const selectedOccurrence =
          group.occurrences.find(
            (occurrence) =>
              occurrence.locator.source === source &&
              occurrence.locator.index === index &&
              occurrence.startOffset === start &&
              occurrence.endOffset === end
          );

        if (!selectedOccurrence) {
          this.clearSearchHighlights();
          return;
        }

        this.highlightOccurrences(
          group.occurrences,
          selectedOccurrence
        );

        const target = this.findSearchTarget(
          selectedOccurrence.locator.source,
          selectedOccurrence.locator.index
        );

        if (!target) {
          return;
        }

        this.scrollToOccurrence(
          target,
          selectedOccurrence.startOffset,
          selectedOccurrence.endOffset
        );

        this.focusSearchTarget(target);
      }
    });
  }

  /**
 * Individua nel DOM l'elemento associato al locator di un risultato di ricerca.
 *
 * Il locator usa source per distinguere titolo, body e link esterni e index per identificare il segmento corretto all'interno della sorgente.
 */
  private findSearchTarget(
    source: string | null,
    index?: number
  ): Element | null {
    const host = this.host.nativeElement;

    switch (source) {
      case 'title':
        return host.querySelector(
          'article > h1'
        );

      case 'body': {
        if (
          index === undefined ||
          Number.isNaN(index)
        ) {
          return null;
        }

        const body = host.querySelector(
          '.article-body'
        );

        if (!body) {
          return null;
        }

        return (
          getSearchableBodyElements(body)[index] ??
          null
        );
      }

      case 'external-link': {
        if (
          index === undefined ||
          Number.isNaN(index)
        ) {
          return null;
        }

        const links =
          host.querySelectorAll(
            'article > section li > a'
          );

        return links[index] ?? null;
      }

      default:
        return null;
    }
  }

  /**
 * Sposta il focus sul segmento che contiene l'occorrenza selezionata.
 *
 * Se il target non è normalmente focalizzabile, aggiunge temporaneamente tabindex="-1" senza inserirlo nell'ordine normale di tabulazione.
 */
  private focusSearchTarget(
    element: Element
  ): void {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const hasTabindex =
      element.hasAttribute('tabindex');

    const needsTemporaryTabindex =
      element.tabIndex < 0 &&
      !hasTabindex;

    if (needsTemporaryTabindex) {
      element.setAttribute(
        'tabindex',
        '-1'
      );
    }

    element.focus({
      preventScroll: true
    });

    if (needsTemporaryTabindex) {
      element.addEventListener(
        'blur',
        () => {
          element.removeAttribute(
            'tabindex'
          );
        },
        {
          once: true
        }
      );
    }
  }

  /**
 * Porta nella viewport l'esatta occorrenza selezionata.
 *
 * Usa gli offset dell'occorrenza per creare un Range sul testo e calcola la posizione di scroll a partire dalle coordinate del Range.
 * Se il Range non può essere creato, ripiega sullo scroll del segmento.
 */
  private scrollToOccurrence(
    element: Element,
    startOffset: number,
    endOffset: number
  ): void {
    const range = this.createTextRange(
      element,
      startOffset,
      endOffset
    );

    const scrollContainer =
      this.host.nativeElement.closest<HTMLElement>(
        '.app-main'
      );

    if (!scrollContainer) {
      element.scrollIntoView({
        block: 'center',
        behavior: 'auto'
      });

      return;
    }

    if (!range) {
      element.scrollIntoView({
        block: 'center',
        behavior: 'auto'
      });

      return;
    }

    const rangeRect =
      range.getBoundingClientRect();

    const containerRect =
      scrollContainer.getBoundingClientRect();

    const targetTop =
      scrollContainer.scrollTop +
      rangeRect.top -
      containerRect.top -
      scrollContainer.clientHeight / 2 +
      rangeRect.height / 2;

    scrollContainer.scrollTo({
      top: targetTop,
      behavior: 'auto'
    });
  }

  /**
 * Crea un Range corrispondente agli offset testuali di una SearchOccurrence.
 *
 * Gli offset sono relativi al testo completo del segmento, che nel DOM può essere distribuito tra più text node a causa del markup inline.
 */
  private createTextRange(
    element: Element,
    startOffset: number,
    endOffset: number
  ): Range | null {
    const document = element.ownerDocument;
    const view = document.defaultView;

    if (!view) {
      return null;
    }

    const walker = document.createTreeWalker(
      element,
      view.NodeFilter.SHOW_TEXT
    );

    let currentOffset = 0;
    let startNode: Text | null = null;
    let endNode: Text | null = null;
    let startNodeOffset = 0;
    let endNodeOffset = 0;

    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const length = textNode.data.length;
      const nodeEnd = currentOffset + length;

      if (
        startNode === null &&
        startOffset >= currentOffset &&
        startOffset <= nodeEnd
      ) {
        startNode = textNode;
        startNodeOffset =
          startOffset - currentOffset;
      }

      if (
        endOffset >= currentOffset &&
        endOffset <= nodeEnd
      ) {
        endNode = textNode;
        endNodeOffset =
          endOffset - currentOffset;

        break;
      }

      currentOffset = nodeEnd;
    }

    if (!startNode || !endNode) {
      return null;
    }

    const range = document.createRange();

    range.setStart(
      startNode,
      startNodeOffset
    );

    range.setEnd(
      endNode,
      endNodeOffset
    );

    return range;
  }

  /**
 * Evidenzia tutte le occorrenze della query presenti nell'articolo.
 *
 * L'occorrenza selezionata viene registrata in un highlight separato con priorità maggiore, così può avere uno stile distinto dalle altre.
 */
  private highlightOccurrences(
    occurrences: readonly SearchResultOccurrence[],
    selectedOccurrence: SearchResultOccurrence
  ): void {
    const document =
      this.host.nativeElement.ownerDocument;
    const view = document.defaultView;

    if (!view) {
      return;
    }

    const browserWindow =
      view as Window & typeof globalThis;

    if (
      !browserWindow.CSS?.highlights ||
      !browserWindow.Highlight
    ) {
      return;
    }

    const ranges: Range[] = [];
    let selectedRange: Range | null = null;

    for (const occurrence of occurrences) {
      const target = this.findSearchTarget(
        occurrence.locator.source,
        occurrence.locator.index
      );

      if (!target) {
        continue;
      }

      const range = this.createTextRange(
        target,
        occurrence.startOffset,
        occurrence.endOffset
      );

      if (!range) {
        continue;
      }

      ranges.push(range);

      if (occurrence === selectedOccurrence) {
        selectedRange = range;
      }
    }

    browserWindow.CSS.highlights.delete(
      'search-occurrence'
    );

    browserWindow.CSS.highlights.delete(
      'selected-search-occurrence'
    );

    if (ranges.length > 0) {
      const highlight =
        new browserWindow.Highlight(...ranges);

      highlight.priority = 0;

      browserWindow.CSS.highlights.set(
        'search-occurrence',
        highlight
      );
    }

    if (selectedRange) {
      const selectedHighlight =
        new browserWindow.Highlight(
          selectedRange
        );

      selectedHighlight.priority = 1;

      browserWindow.CSS.highlights.set(
        'selected-search-occurrence',
        selectedHighlight
      );
    }
  }

  /**
 * Rimuove gli highlight della ricerca registrati nel browser.
 *
 * Viene usato quando la pagina non dispone più di uno stato di ricerca valido da applicare all'articolo corrente.
 */
  private clearSearchHighlights(): void {
    const document =
      this.host.nativeElement.ownerDocument;
    const view = document.defaultView;

    if (!view) {
      return;
    }

    const browserWindow =
      view as Window & typeof globalThis;

    if (!browserWindow.CSS?.highlights) {
      return;
    }

    browserWindow.CSS.highlights.delete(
      'search-occurrence'
    );

    browserWindow.CSS.highlights.delete(
      'selected-search-occurrence'
    );
  }

  private highlightCode(): void {
    const body = this.host.nativeElement.querySelector(
      '.article-body'
    );

    if (!body) {
      return;
    }

    const codeElements =
      body.querySelectorAll<HTMLElement>(
        'code[class*="language-"]:not([data-prism-highlighted])'
      );

    for (const code of codeElements) {
      if (code.closest('pre')) {
        code.classList.add('match-braces');
      }

      Prism.highlightElement(code);

      code.dataset['prismHighlighted'] = 'true';
    }
  }

  /**
 * Applica il progressive enhancement agli embed CodePen dell'articolo.
 *
 * @param rawBodyHtml Markup originale ricevuto da Drupal.
 */
  private enhanceCodePen(
    rawBodyHtml: string,
    area: string
  ): void {
    const body =
      this.host.nativeElement.querySelector<HTMLElement>(
        '.article-body'
      );

    if (!body) {
      return;
    }

    this.codePenEmbed.enhance(
      body,
      rawBodyHtml,
      area
    );
  }

  /**
   * Stato dell'articolo identificato dai parametri area e slug della route.
   */
  readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const area = params.get('area');
        const slug = params.get('slug');

        if (!area || !slug) {
          return of<ArticlePageState>({
            status: 'not-found',
            article: null,
          });
        }

        const path = `/appunti/${area}/${slug}`;

        let articleId: number | null = null;

        return this.contentRepository
          .getArticlesByArea(area)
          .pipe(
            map((articles) => {
              const articleByPath =
                articles.find(
                  (item) => item.path === path
                ) ?? null;

              if (articleByPath) {
                articleId = articleByPath.id;

                return {
                  status: 'ready' as const,
                  article: articleByPath,
                };
              }

              if (articleId !== null) {
                const articleById =
                  articles.find(
                    (item) => item.id === articleId
                  ) ?? null;

                if (articleById) {
                  if (
                    articleById.path !== path
                  ) {
                    void this.router.navigateByUrl(
                      articleById.path,
                      {
                        replaceUrl: true
                      }
                    );
                  }

                  return {
                    status: 'ready' as const,
                    article: articleById,
                  };
                }
              }

              return {
                status: 'not-found' as const,
                article: null,
              };
            }),
            catchError(() =>
              of<ArticlePageState>({
                status: 'error',
                article: null,
              })
            ),
          );
      }),
    ),
    {
      initialValue: {
        status: 'loading',
        article: null,
      } satisfies ArticlePageState,
    },
  );
}
