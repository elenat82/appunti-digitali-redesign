<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\aggregator\ItemInterface;

/**
 * Retrieves news from configured RSS sources.
 */
class NewsService implements NewsServiceInterface {

  /**
   * Maximum number of news items returned per source.
   */
  private const NEWS_PER_SOURCE = 5;

  /**
   * Constructs the news service.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function getNews(): array {
    $feed_storage = $this->entityTypeManager
      ->getStorage('aggregator_feed');

    $item_storage = $this->entityTypeManager
      ->getStorage('aggregator_item');

    $feed_ids = $feed_storage
      ->getQuery()
      ->accessCheck(FALSE)
      ->execute();

    if (!$feed_ids) {
      return [];
    }

    $feeds = $feed_storage->loadMultiple($feed_ids);
    $news = [];

    foreach ($feeds as $feed) {
      $item_ids = $item_storage
        ->getQuery()
        ->accessCheck(FALSE)
        ->condition('fid', $feed->id())
        ->sort('timestamp', 'DESC')
        ->range(0, self::NEWS_PER_SOURCE)
        ->execute();

      if (!$item_ids) {
        continue;
      }

      $items = $item_storage->loadMultiple($item_ids);

      foreach ($items as $item) {
        if (!$item instanceof ItemInterface) {
          continue;
        }

        $author = $item->getAuthor();

        $news[] = [
          'id' => (int) $item->id(),
          'title' => $item->getTitle(),
          'url' => $item->getLink(),
          'source' => (string) $feed->label(),
          'author' => $author !== '' ? $author : NULL,
          'date' => (int) $item->getPostedTime(),
        ];
      }
    }

    usort(
      $news,
      static fn(array $first, array $second): int =>
      $second['date'] <=> $first['date']
    );

    return $news;
  }

}
