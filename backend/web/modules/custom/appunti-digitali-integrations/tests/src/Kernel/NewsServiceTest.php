<?php

namespace Drupal\Tests\appunti_digitali_integrations\Kernel;

use Drupal\appunti_digitali_integrations\Service\NewsServiceInterface;
use Drupal\KernelTests\KernelTestBase;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the news service.
 */
#[RunTestsInSeparateProcesses]
class NewsServiceTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'file',
    'options',
    'taxonomy',
    'aggregator',
    'appunti_digitali_integrations',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('aggregator_feed');
    $this->installEntitySchema('aggregator_item');
  }

  /**
   * Tests that no news is returned when no feeds exist.
   */
  public function testReturnsEmptyArrayWithoutFeeds(): void {
    $this->assertSame(
      [],
      $this->getNewsService()->getNews()
    );
  }

  /**
   * Tests news item normalization.
   */
  public function testNormalizesNewsItem(): void {
    $feed_id = $this->createFeed(
      'Brad Frost',
      'https://example.com/brad-frost.xml'
    );

    $item_id = $this->createItem(
      $feed_id,
      'Poetic CSS',
      'https://example.com/poetic-css',
      300,
      'Brad Frost'
    );

    $this->assertSame(
      [
        [
          'id' => $item_id,
          'title' => 'Poetic CSS',
          'url' => 'https://example.com/poetic-css',
          'source' => 'Brad Frost',
          'author' => 'Brad Frost',
          'date' => 300,
        ],
      ],
      $this->getNewsService()->getNews()
    );
  }

  /**
   * Tests that a missing author is normalized to NULL.
   */
  public function testMissingAuthor(): void {
    $feed_id = $this->createFeed(
      'Example feed',
      'https://example.com/feed.xml'
    );

    $this->createItem(
      $feed_id,
      'Article without author',
      'https://example.com/article',
      300
    );

    $news = $this->getNewsService()->getNews();

    $this->assertCount(1, $news);
    $this->assertNull($news[0]['author']);
  }

  /**
   * Tests that at most five items are returned per source.
   */
  public function testLimitsNewsToFiveItemsPerSource(): void {
    $feed_a_id = $this->createFeed(
      'Feed A',
      'https://example.com/feed-a.xml'
    );

    $feed_b_id = $this->createFeed(
      'Feed B',
      'https://example.com/feed-b.xml'
    );

    for ($i = 1; $i <= 6; $i++) {
      $this->createItem(
        $feed_a_id,
        "Feed A item $i",
        "https://example.com/feed-a/$i",
        $i * 100
      );
    }

    for ($i = 1; $i <= 2; $i++) {
      $this->createItem(
        $feed_b_id,
        "Feed B item $i",
        "https://example.com/feed-b/$i",
        $i * 50
      );
    }

    $news = $this->getNewsService()->getNews();

    $feed_a_news = array_values(
      array_filter(
        $news,
        static fn(array $item): bool =>
          $item['source'] === 'Feed A'
      )
    );

    $feed_b_news = array_values(
      array_filter(
        $news,
        static fn(array $item): bool =>
          $item['source'] === 'Feed B'
      )
    );

    $this->assertCount(5, $feed_a_news);
    $this->assertCount(2, $feed_b_news);
    $this->assertCount(7, $news);

    $this->assertSame(
      [
        'Feed A item 6',
        'Feed A item 5',
        'Feed A item 4',
        'Feed A item 3',
        'Feed A item 2',
      ],
      array_column($feed_a_news, 'title')
    );
  }

  /**
   * Tests global ordering by date across different sources.
   */
  public function testSortsNewsByDateDescending(): void {
    $feed_a_id = $this->createFeed(
      'Feed A',
      'https://example.com/feed-a.xml'
    );

    $feed_b_id = $this->createFeed(
      'Feed B',
      'https://example.com/feed-b.xml'
    );

    $this->createItem(
      $feed_a_id,
      'Feed A older',
      'https://example.com/a-older',
      100
    );

    $this->createItem(
      $feed_a_id,
      'Feed A newer',
      'https://example.com/a-newer',
      300
    );

    $this->createItem(
      $feed_b_id,
      'Feed B older',
      'https://example.com/b-older',
      200
    );

    $this->createItem(
      $feed_b_id,
      'Feed B newer',
      'https://example.com/b-newer',
      400
    );

    $news = $this->getNewsService()->getNews();

    $this->assertSame(
      [400, 300, 200, 100],
      array_column($news, 'date')
    );

    $this->assertSame(
      [
        'Feed B newer',
        'Feed A newer',
        'Feed B older',
        'Feed A older',
      ],
      array_column($news, 'title')
    );
  }

  /**
   * Creates an Aggregator feed.
   */
  private function createFeed(
    string $title,
    string $url,
  ): int {
    $feed = $this->container
      ->get('entity_type.manager')
      ->getStorage('aggregator_feed')
      ->create([
        'title' => $title,
        'url' => $url,
        'refresh' => 86400,
      ]);

    $feed->save();

    return (int) $feed->id();
  }

  /**
   * Creates an Aggregator item.
   */
  private function createItem(
    int $feed_id,
    string $title,
    string $url,
    int $timestamp,
    ?string $author = NULL,
  ): int {
    $values = [
      'fid' => $feed_id,
      'title' => $title,
      'link' => $url,
      'timestamp' => $timestamp,
      'guid' => $url,
    ];

    if ($author !== NULL) {
      $values['author'] = $author;
    }

    $item = $this->container
      ->get('entity_type.manager')
      ->getStorage('aggregator_item')
      ->create($values);

    $item->save();

    return (int) $item->id();
  }

  /**
   * Returns the news service.
   */
  private function getNewsService(): NewsServiceInterface {
    return $this->container->get(
      'appunti_digitali_integrations.news_service'
    );
  }

}
