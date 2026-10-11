import {
  readdir,
  writeFile
} from 'node:fs/promises';

import {
  dirname,
  join,
  relative,
  sep
} from 'node:path';

import {
  fileURLToPath
} from 'node:url';

const SITE_BASE_URL =
  'https://www.appunti-digitali.it';

const frontendRoot =
  fileURLToPath(
    new URL(
      '..',
      import.meta.url
    )
  );

const browserDirectory =
  join(
    frontendRoot,
    'dist',
    'frontend',
    'browser'
  );

const articlesDirectory =
  join(
    browserDirectory,
    'appunti'
  );

async function findIndexFiles(
  directory
) {
  const entries =
    await readdir(
      directory,
      {
        withFileTypes: true
      }
    );

  const indexFiles = [];

  for (const entry of entries) {
    const path =
      join(
        directory,
        entry.name
      );

    if (entry.isDirectory()) {
      indexFiles.push(
        ...await findIndexFiles(
          path
        )
      );

      continue;
    }

    if (
      entry.isFile() &&
      entry.name === 'index.html'
    ) {
      indexFiles.push(path);
    }
  }

  return indexFiles;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;');
}

function buildSitemapXml(paths) {
  const entries =
    paths
      .map((path) => {
        const location =
          new URL(
            path,
            SITE_BASE_URL
          ).toString();

        return [
          '  <url>',
          `    <loc>${escapeXml(location)}</loc>`,
          '  </url>'
        ].join('\n');
      })
      .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    ''
  ].join('\n');
}

const indexFiles =
  await findIndexFiles(
    articlesDirectory
  );

const articlePaths =
  indexFiles
    .map((indexFile) => {
      const directory =
        dirname(indexFile);

      const path =
        relative(
          browserDirectory,
          directory
        )
          .split(sep)
          .join('/');

      return `/${path}`;
    })
    .sort();

const paths = [
  '/',
  ...articlePaths
];

const sitemap =
  buildSitemapXml(paths);

await writeFile(
  join(
    browserDirectory,
    'sitemap.xml'
  ),
  sitemap,
  'utf8'
);

console.log(
  `Generated sitemap.xml with ${paths.length} URLs.`
);
