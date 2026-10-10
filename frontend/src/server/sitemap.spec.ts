import {
  buildSitemapXml
} from './sitemap';

describe('buildSitemapXml', () => {
  it('genera la sitemap con home e articoli', () => {
    const xml = buildSitemapXml(
      [
        '/appunti/css/css-grid',
        '/appunti/html/elementi-html'
      ],
      'https://www.appunti-digitali.it'
    );

    expect(xml).toContain(
      '<loc>https://www.appunti-digitali.it/</loc>'
    );

    expect(xml).toContain(
      '<loc>https://www.appunti-digitali.it/appunti/css/css-grid</loc>'
    );

    expect(xml).toContain(
      '<loc>https://www.appunti-digitali.it/appunti/html/elementi-html</loc>'
    );
  });
});
