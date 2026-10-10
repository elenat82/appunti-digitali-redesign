import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  Meta,
  Title
} from '@angular/platform-browser';

import {
  HttpClient
} from '@angular/common/http';

import {
  toSignal
} from '@angular/core/rxjs-interop';

import {
  catchError,
  map,
  of,
  startWith
} from 'rxjs';

import {
  SeoService
} from '../../../core/seo/seo.service';

const PRIVACY_TITLE =
  'Informativa privacy | Appunti Digitali';

const PRIVACY_DESCRIPTION =
  'Informativa privacy e informazioni sull’utilizzo di cookie e servizi di terze parti di Appunti Digitali.';

interface PrivacyContentState {
  status: 'loading' | 'ready' | 'error';
  content: string;
}

@Component({
  selector: 'app-privacy-page',
  templateUrl: './privacy-page.html',
  styleUrl: './privacy-page.scss',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PrivacyPage {
  private readonly title =
    inject(Title);

  private readonly meta =
    inject(Meta);

  private readonly seo =
    inject(SeoService);

  private readonly http =
    inject(HttpClient);

  constructor() {
    this.title.setTitle(
      PRIVACY_TITLE
    );

    this.meta.updateTag({
      name: 'description',
      content: PRIVACY_DESCRIPTION
    });

    this.seo.setCanonical(
      '/privacy'
    );

    this.seo.setOpenGraph({
      type: 'website',
      title: PRIVACY_TITLE,
      description:
        PRIVACY_DESCRIPTION,
      path: '/privacy'
    });
  }

  protected readonly contentState =
    toSignal(
      this.http
        .get(
          '/content/privacy-policy.html',
          {
            responseType: 'text'
          }
        )
        .pipe(
          map(
            (content):
              PrivacyContentState => ({
                status: 'ready',
                content
              })
          ),
          catchError(
            () =>
              of<PrivacyContentState>({
                status: 'error',
                content: ''
              })
          ),
          startWith<PrivacyContentState>({
            status: 'loading',
            content: ''
          })
        ),
      {
        initialValue: {
          status: 'loading',
          content: ''
        } satisfies PrivacyContentState
      }
    );
}
