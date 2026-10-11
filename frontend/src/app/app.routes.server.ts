import {
  PrerenderFallback,
  RenderMode,
  ServerRoute
} from '@angular/ssr';

import { environment } from '../environments/environment';

interface SitemapResponse {
  paths: string[];
}

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'appunti/:area/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    async getPrerenderParams() {
      const response = await fetch(
        `${environment.apiBaseUrl}/api/sitemap`
      );

      if (!response.ok) {
        throw new Error(
          `Sitemap API returned ${response.status}`
        );
      }

      const data =
        await response.json() as SitemapResponse;

      return data.paths.map((path) => {
        const segments = path
          .split('/')
          .filter(Boolean);

        if (
          segments.length !== 3 ||
          segments[0] !== 'appunti'
        ) {
          throw new Error(
            `Unexpected article path: ${path}`
          );
        }

        return {
          area: decodeURIComponent(
            segments[1]
          ),
          slug: decodeURIComponent(
            segments[2]
          )
        };
      });
    }
  }
];
