import { Article } from '../../../core/models/article.model';
import { buildArticleSearchSegments } from './build-article-search-segments';

describe('buildArticleSearchSegments', () => {
  const createArticle = (body: string): Article => ({
    id: 42,
    title: 'Titolo Drupal',
    area: 'drupal',
    body,
    externalLinks: [],
    weight: 0
  });

  it('crea un segmento autonomo per il titolo', () => {
    const segments = buildArticleSearchSegments(
      createArticle('<p>Contenuto</p>')
    );

    expect(segments[0]).toEqual({
      id: 'article-42-segment-0',
      articleId: 42,
      type: 'title',
      order: 0,
      text: 'Titolo Drupal',
      searchText: 'titolo drupal',
      locator: {
        source: 'title'
      }
    });
  });

  it('segmenta heading e paragrafi mantenendo l\'ordine', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <h2>Services</h2>
        <p>Drupal utilizza i service.</p>
        <h3>Dependency Injection</h3>
      `)
    );

    expect(
      segments.map((segment) => ({
        type: segment.type,
        text: segment.text.trim()
      }))
    ).toEqual([
      {
        type: 'title',
        text: 'Titolo Drupal'
      },
      {
        type: 'heading',
        text: 'Services'
      },
      {
        type: 'paragraph',
        text: 'Drupal utilizza i service.'
      },
      {
        type: 'heading',
        text: 'Dependency Injection'
      }
    ]);
  });

  it('mantiene il codice inline nel segmento del paragrafo', () => {
    const segments = buildArticleSearchSegments(
      createArticle(
        '<p>Il file <code>nome_modulo.info.yml</code> contiene la configurazione.</p>'
      )
    );

    expect(segments[1].type).toBe('paragraph');
    expect(segments[1].text).toBe(
      'Il file nome_modulo.info.yml contiene la configurazione.'
    );
  });

  it('crea un segmento distinto per ogni elemento di lista', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <ul>
          <li>Primo elemento</li>
          <li>Secondo elemento</li>
        </ul>
      `)
    );

    expect(
      segments.slice(1).map((segment) => segment.text.trim())
    ).toEqual([
      'Primo elemento',
      'Secondo elemento'
    ]);
  });

  it('non duplica i paragrafi contenuti negli elementi di lista', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <ul>
          <li>
            <p>Elemento con paragrafo.</p>
          </li>
        </ul>
      `)
    );

    expect(segments).toHaveLength(2);
    expect(segments[1].type).toBe('list-item');
    expect(segments[1].text.trim()).toBe('Elemento con paragrafo.');
  });

  it('gestisce separatamente gli elementi di liste annidate', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <ul>
          <li>
            Elemento padre
            <ul>
              <li>Elemento figlio</li>
            </ul>
          </li>
        </ul>
      `)
    );

    expect(
      segments.slice(1).map((segment) => segment.text.trim())
    ).toEqual([
      'Elemento padre',
      'Elemento figlio'
    ]);
  });

  it('crea un segmento distinto per ogni cella della tabella', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <table>
          <tr>
            <th>Comando</th>
            <th>Descrizione</th>
          </tr>
          <tr>
            <td>drush cr</td>
            <td>Ricostruisce la cache.</td>
          </tr>
        </table>
      `)
    );

    expect(
      segments.slice(1).map((segment) => segment.text.trim())
    ).toEqual([
      'Comando',
      'Descrizione',
      'drush cr',
      'Ricostruisce la cache.'
    ]);
  });

  it('crea un solo segmento per pre e code annidati', () => {
    const segments = buildArticleSearchSegments(
      createArticle(
        '<pre><code>drush cr\ncomposer install</code></pre>'
      )
    );

    expect(segments).toHaveLength(2);
    expect(segments[1].type).toBe('code-block');
    expect(segments[1].text).toBe(
      'drush cr\ncomposer install'
    );
  });

  it('assegna locator e identificativi deterministici ai segmenti del body', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <h2>Heading</h2>
        <p>Paragrafo</p>
      `)
    );

    expect(segments[1].id).toBe('article-42-segment-1');
    expect(segments[1].order).toBe(1);
    expect(segments[1].locator).toEqual({
      source: 'body',
      index: 0
    });

    expect(segments[2].id).toBe('article-42-segment-2');
    expect(segments[2].order).toBe(2);
    expect(segments[2].locator).toEqual({
      source: 'body',
      index: 1
    });
  });

  it('ignora i segmenti privi di contenuto testuale', () => {
    const segments = buildArticleSearchSegments(
      createArticle(`
        <h2></h2>
        <p>   </p>
        <p>Contenuto reale</p>
      `)
    );

    expect(segments).toHaveLength(2);
    expect(segments[1].text).toBe('Contenuto reale');
  });

  it('crea un segmento per ogni link di approfondimento', () => {
    const article: Article = {
      ...createArticle('<p>Contenuto</p>'),
      externalLinks: [
        {
          title: 'Drupal documentation',
          url: 'https://www.drupal.org/docs'
        },
        {
          title: 'Angular documentation',
          url: 'https://angular.dev'
        }
      ]
    };

    const segments = buildArticleSearchSegments(article);

    expect(
      segments
        .filter((segment) => segment.type === 'external-link')
        .map((segment) => segment.text)
    ).toEqual([
      'Drupal documentation\nhttps://www.drupal.org/docs',
      'Angular documentation\nhttps://angular.dev'
    ]);
  });

  it('rende ricercabili sia il titolo sia l\'URL del link', () => {
    const article: Article = {
      ...createArticle(''),
      externalLinks: [
        {
          title: 'Drupal Documentation',
          url: 'https://www.DRUPAL.org/docs'
        }
      ]
    };

    const segments = buildArticleSearchSegments(article);
    const externalLink = segments.find(
      (segment) => segment.type === 'external-link'
    );

    expect(externalLink?.searchText).toBe(
      'drupal documentation\nhttps://www.drupal.org/docs'
    );
  });

  it('utilizza solo l\'URL quando il link non ha un titolo', () => {
    const article: Article = {
      ...createArticle(''),
      externalLinks: [
        {
          title: '',
          url: 'https://www.drupal.org/docs'
        }
      ]
    };

    const segments = buildArticleSearchSegments(article);
    const externalLink = segments.find(
      (segment) => segment.type === 'external-link'
    );

    expect(externalLink?.text).toBe(
      'https://www.drupal.org/docs'
    );
  });

  it('assegna un locator indipendente a ogni link di approfondimento', () => {
    const article: Article = {
      ...createArticle(''),
      externalLinks: [
        {
          title: 'Primo',
          url: 'https://example.com/first'
        },
        {
          title: 'Secondo',
          url: 'https://example.com/second'
        }
      ]
    };

    const segments = buildArticleSearchSegments(article);
    const externalLinks = segments.filter(
      (segment) => segment.type === 'external-link'
    );

    expect(externalLinks[0].locator).toEqual({
      source: 'external-link',
      index: 0
    });

    expect(externalLinks[1].locator).toEqual({
      source: 'external-link',
      index: 1
    });
  });

});
