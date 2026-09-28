<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\taxonomy\TermInterface;
use GuzzleHttp\ClientInterface;
use Drupal\Core\Cache\CacheBackendInterface;

/**
 * Provides Stack Overflow integration functionality.
 */
final class StackOverflowClient implements StackOverflowClientInterface {
  private const API_URL = 'https://api.stackexchange.com/2.3/search';

  private const FETCH_SIZE = 50;

  private const RESULT_LIMIT = 20;

  private const CACHE_PREFIX = 'appunti_digitali_integrations:stackoverflow:';

  private const CACHE_MAX_AGE = 1800;

  /**
   * Constructs a StackOverflowClient object.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly ClientInterface $httpClient,
    private readonly CacheBackendInterface $cache,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function getTags(): array {
    $storage = $this->entityTypeManager
      ->getStorage('taxonomy_term');

    $term_ids = $storage
      ->getQuery()
      ->condition('vid', 'stack_overflow_tags')
      ->condition('status', 1)
      ->exists('field_stack_overflow_tag')
      ->sort('weight')
      ->sort('name')
      ->accessCheck(TRUE)
      ->execute();

    if (!$term_ids) {
      return [];
    }

    $tags = [];

    foreach ($storage->loadMultiple($term_ids) as $term) {
      if (!$term instanceof TermInterface) {
        continue;
      }

      $tag = trim(
        $term
          ->get('field_stack_overflow_tag')
          ->getString()
      );

      if ($tag !== '') {
        $tags[] = $tag;
      }
    }

    return array_values(
      array_unique($tags)
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getQuestions(): array {
    $tags = $this->getTags();

    if ($tags === []) {
      return [];
    }

    $cache_id =
    self::CACHE_PREFIX .
    hash('sha256', implode('|', $tags));

    if ($cached = $this->cache->get($cache_id)) {
      return $cached->data;
    }

    $response = $this->httpClient->request(
    'GET',
    self::API_URL,
    [
      'query' => [
        'site' => 'stackoverflow',
        'tagged' => implode(';', $tags),
        'sort' => 'activity',
        'order' => 'desc',
        'pagesize' => self::FETCH_SIZE,
      ],
    ]
    );

    $data = json_decode(
    (string) $response->getBody(),
    TRUE,
    512,
    JSON_THROW_ON_ERROR
    );

    if (
    !isset($data['items']) ||
    !is_array($data['items'])
    ) {
      return [];
    }

    $questions = [];

    foreach ($data['items'] as $item) {
      if (
      !isset($item['score']) ||
      $item['score'] < 0
      ) {
        continue;
      }

      $questions[] = [
        'id' => $item['question_id'],
        'title' => html_entity_decode(
        $item['title'],
        ENT_QUOTES | ENT_HTML5,
        'UTF-8'
        ),
        'url' => $item['link'],
        'tags' => $item['tags'],
        'score' => $item['score'],
        'answerCount' => $item['answer_count'],
        'isAnswered' => $item['is_answered'],
        'lastActivityDate' =>
        $item['last_activity_date'],
      ];

      if (
      count($questions) ===
      self::RESULT_LIMIT
      ) {
        break;
      }
    }

    $this->cache->set(
    $cache_id,
    $questions,
    time() + self::CACHE_MAX_AGE
    );

    return $questions;
  }

}
