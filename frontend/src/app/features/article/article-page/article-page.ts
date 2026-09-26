import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, last, map, of, switchMap } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { ContentRepositoryService } from '../../../core/data-access/content-repository.service';
import {
  getSearchableBodyElements
} from '../../search/utils/article-search-dom';
import { SearchResultOccurrence } from '../../search/models/search-result.model';
import { SearchService } from '../../search/services/search.service';

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
  private readonly contentRepository = inject(ContentRepositoryService);
  private readonly host =
    inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly search = inject(SearchService);

  private readonly queryParamMap = toSignal(
    this.route.queryParamMap,
    {
      initialValue: this.route.snapshot.queryParamMap
    }
  );

  constructor() {
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

    if (!range) {
      element.scrollIntoView({
        block: 'center',
        behavior: 'auto'
      });

      return;
    }

    const document = element.ownerDocument;
    const view = document.defaultView;

    if (!view) {
      return;
    }

    const rect = range.getBoundingClientRect();

    const targetTop =
      view.scrollY +
      rect.top -
      view.innerHeight / 2 +
      rect.height / 2;

    view.scrollTo({
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

        const path = `/${area}/${slug}`;

        return this.contentRepository.getArticlesByArea(area).pipe(
          last(),
          map((articles) => {
            const article =
              articles.find((item) => item.path === path) ?? null;

            return article
              ? {
                status: 'ready' as const,
                article,
              }
              : {
                status: 'not-found' as const,
                article: null,
              };
          }),
          catchError(() =>
            of<ArticlePageState>({
              status: 'error',
              article: null,
            }),
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
