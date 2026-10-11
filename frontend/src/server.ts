import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  environment
} from './environments/environment';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

const allowedHosts = [
  new URL(environment.siteBaseUrl).hostname
];

if (!environment.production) {
  allowedHosts.push('localhost');
}

const angularApp = new AngularNodeAppEngine({
  allowedHosts
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.get(
  '/appunti/:area/:slug',
  async (req, res, next) => {
    try {
      const response = await fetch(
        `${environment.apiBaseUrl}${req.path}`,
        {
          method: 'HEAD',
          redirect: 'manual'
        }
      );

      const location =
        response.headers.get('location');

      if (
        response.status >= 300 &&
        response.status < 400 &&
        location
      ) {
        const targetUrl = new URL(
          location,
          environment.apiBaseUrl
        );

        const target =
          `${targetUrl.pathname}` +
          `${targetUrl.search}` +
          `${targetUrl.hash}`;

        res.redirect(
          response.status,
          target
        );

        return;
      }

      next();
    }
    catch {
      next();
    }
  }
);

const contentFolder = join(
  browserDistFolder,
  'content'
);

app.use(
  '/content',
  express.static(
    contentFolder,
    {
      maxAge: 0,
      index: false,
      redirect: false,
    }
  ),
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge:
      environment.production
        ? '1y'
        : 0,
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
