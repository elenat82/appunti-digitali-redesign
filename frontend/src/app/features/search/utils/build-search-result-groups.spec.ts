import { Article } from '../../../core/models/article.model';
import { SearchOccurrence } from '../models/search-occurrence.model';
import { SearchSegment } from '../models/search-segment.model';
import { buildSearchResultGroups } from './build-search-result-groups';

describe('buildSearchResultGroups', () => {
  const articles: Article[] = [
    {
      id: 1,
      title: 'Articolo Drupal',
      area: 'drupal',
      body: '',
      externalLinks: [],
      weight: 0
    },
    {
      id: 2,
      title: 'Articolo Angular',
      area: 'angular',
      body: '',
      externalLinks: [],
      weight: 0
    }
  ];

  const segments: SearchSegment[] = [
    {
      id: 'article-1-segment-1',
      articleId: 1,
      type: 'paragraph',
      order: 1,
      text: 'Drupal Drupal',
      searchText: 'drupal drupal',
      locator: {
        source: 'body',
        index: 0
      }
    },
    {
      id: 'article-2-segment-1',
      articleId: 2,
      type: 'paragraph',
      order: 1,
      text: 'Angular e Drupal',
      searchText: 'angular e drupal',
      locator: {
        source: 'body',
        index: 0
      }
    }
  ];

  const occurrences: SearchOccurrence[] = [
    {
      articleId: 1,
      segmentId: 'article-1-segment-1',
      startOffset: 0,
      endOffset: 6
    },
    {
      articleId: 1,
      segmentId: 'article-1-segment-1',
      startOffset: 7,
      endOffset: 13
    },
    {
      articleId: 2,
      segmentId: 'article-2-segment-1',
      startOffset: 10,
      endOffset: 16
    }
  ];

  it('raggruppa le occorrenze per articolo', () => {
    const groups = buildSearchResultGroups(
      articles,
      segments,
      occurrences
    );

    expect(groups).toHaveLength(2);
    expect(
      groups[0].occurrences[0].segmentType
    ).toBe('paragraph');

    expect(groups[0].articleId).toBe(1);
    expect(groups[0].articleTitle).toBe(
      'Articolo Drupal'
    );
    expect(groups[0].areaId).toBe('drupal');
    expect(groups[0].occurrences).toHaveLength(2);

    expect(groups[1].articleId).toBe(2);
    expect(groups[1].occurrences).toHaveLength(1);
  });

  it('mantiene l\'ordine delle occorrenze', () => {
    const groups = buildSearchResultGroups(
      articles,
      segments,
      occurrences
    );

    expect(
      groups[0].occurrences.map(
        (occurrence) => occurrence.startOffset
      )
    ).toEqual([0, 7]);
  });

  it('genera uno snippet per ogni occorrenza', () => {
    const groups = buildSearchResultGroups(
      articles,
      segments,
      occurrences
    );

    expect(
      groups[0].occurrences[0].snippet.match
    ).toBe('Drupal');

    expect(
      groups[0].occurrences[1].snippet.match
    ).toBe('Drupal');
  });

  it('non crea gruppi per articoli senza occorrenze', () => {
    const groups = buildSearchResultGroups(
      articles,
      segments,
      [occurrences[2]]
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].articleId).toBe(2);
  });
});
