export function buildSitemapXml(
  paths: readonly string[],
  siteBaseUrl: string
): string {
  const urls = [
    '/',
    ...paths
  ];

  const entries = urls
    .map((path) => {
      const location = new URL(
        path,
        siteBaseUrl
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

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;');
}
