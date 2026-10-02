<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali_integrations\Kernel;

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\KernelTests\KernelTestBase;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\appunti_digitali_integrations\Service\StackOverflowClient;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Psr7\Response;
use Drupal\appunti_digitali_integrations\Service\StackOverflowClientInterface;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the Stack Overflow integration service.
 *
 * @group appunti_digitali_integrations
 */
#[RunTestsInSeparateProcesses]
final class StackOverflowClientTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'field',
    'filter',
    'text',
    'user',
    'taxonomy',
    'appunti_digitali_integrations',
  ];

  /**
   * The Stack Overflow integration service.
   */
  private StackOverflowClientInterface $client;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('taxonomy_term');

    Vocabulary::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Stack Overflow tags',
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_stack_overflow_tag',
      'entity_type' => 'taxonomy_term',
      'type' => 'string',
      'cardinality' => 1,
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_stack_overflow_tag',
      'entity_type' => 'taxonomy_term',
      'bundle' => 'stack_overflow_tags',
      'label' => 'Stack Overflow tag',
      'required' => TRUE,
    ])->save();

    $this->client = $this->container->get(
      'appunti_digitali_integrations.stack_overflow_client'
    );
  }

  /**
   * Creates a Stack Overflow client with the given HTTP client.
   */
  private function createClient(
    ClientInterface $http_client,
  ): StackOverflowClient {
    return new StackOverflowClient(
      $this->container->get('entity_type.manager'),
      $http_client,
      $this->container->get('cache.default'),
      $this->container->get(
        'logger.channel.appunti_digitali_integrations'
      ),
    );
  }

  /**
   * Tests that configured published tags are returned.
   */
  public function testGetTags(): void {
    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Angular',
      'status' => 1,
      'weight' => 0,
      'field_stack_overflow_tag' => 'angular',
    ])->save();

    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'TypeScript',
      'status' => 1,
      'weight' => 1,
      'field_stack_overflow_tag' => 'typescript',
    ])->save();

    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'JavaScript',
      'status' => 0,
      'weight' => 2,
      'field_stack_overflow_tag' => 'javascript',
    ])->save();

    $this->assertSame(
      [
        'angular',
        'typescript',
      ],
      $this->client->getTags()
    );
  }

  /**
   * Tests that no tags are returned when the vocabulary is empty.
   */
  public function testGetTagsReturnsEmptyArray(): void {
    $this->assertSame(
      [],
      $this->client->getTags()
    );
  }

  /**
   * Tests that questions are returned.
   */
  public function testGetQuestions(): void {
    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Angular',
      'status' => 1,
      'field_stack_overflow_tag' => 'angular',
    ])->save();

    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'JavaScript',
      'status' => 1,
      'field_stack_overflow_tag' => 'javascript',
    ])->save();

    $api_response = [
      'items' => [
        [
          'question_id' => 12345,
          'title' => 'Titolo della domanda su Angular',
          'link' => 'https://stackoverflow.com/questions/12345',
          'tags' => [
            'angular',
            'javascript',
          ],
          'score' => 234,
          'answer_count' => 7,
          'is_answered' => TRUE,
          'last_activity_date' => 1234567890,
        ],
      ],
    ];

    $response = new Response(
      200,
      ['Content-Type' => 'application/json'],
      json_encode(
        $api_response,
        JSON_THROW_ON_ERROR
      )
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->once())
      ->method('request')
      ->with(
        'GET',
        'https://api.stackexchange.com/2.3/search',
        [
          'query' => [
            'site' => 'stackoverflow',
            'tagged' => 'angular;javascript',
            'sort' => 'activity',
            'order' => 'desc',
            'pagesize' => 50,
          ],
        ]
      )
      ->willReturn($response);

    $client = $this->createClient($http_client);

    $this->assertSame(
      [
        [
          'id' => 12345,
          'title' => 'Titolo della domanda su Angular',
          'url' => 'https://stackoverflow.com/questions/12345',
          'tags' => [
            'angular',
            'javascript',
          ],
          'score' => 234,
          'answerCount' => 7,
          'isAnswered' => TRUE,
          'lastActivityDate' => 1234567890,
        ],
      ],
      $client->getQuestions()
    );
  }

  /**
   * Tests that questions with a negative score are excluded.
   */
  public function testGetQuestionsExcludesNegativeScores(): void {
    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Angular',
      'status' => 1,
      'field_stack_overflow_tag' => 'angular',
    ])->save();

    $api_response = [
      'items' => [
        [
          'question_id' => 1,
          'title' => 'Positive question',
          'link' => 'https://stackoverflow.com/questions/1',
          'tags' => ['angular'],
          'score' => 3,
          'answer_count' => 1,
          'is_answered' => TRUE,
          'last_activity_date' => 1000,
        ],
        [
          'question_id' => 2,
          'title' => 'Negative question',
          'link' => 'https://stackoverflow.com/questions/2',
          'tags' => ['angular'],
          'score' => -1,
          'answer_count' => 0,
          'is_answered' => FALSE,
          'last_activity_date' => 900,
        ],
      ],
    ];

    $response = new Response(
      200,
      ['Content-Type' => 'application/json'],
      json_encode(
        $api_response,
        JSON_THROW_ON_ERROR
      )
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->method('request')
      ->willReturn($response);

    $client = $this->createClient($http_client);

    $questions = $client->getQuestions();

    $this->assertCount(1, $questions);
    $this->assertSame(
      1,
      $questions[0]['id']
    );
  }

  /**
   * Tests that no more than 20 questions are returned.
   */
  public function testGetQuestionsLimitsResults(): void {
    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Angular',
      'status' => 1,
      'field_stack_overflow_tag' => 'angular',
    ])->save();

    $items = [];

    for ($i = 1; $i <= 25; $i++) {
      $items[] = [
        'question_id' => $i,
        'title' => "Question {$i}",
        'link' => "https://stackoverflow.com/questions/{$i}",
        'tags' => ['angular'],
        'score' => 1,
        'answer_count' => 0,
        'is_answered' => FALSE,
        'last_activity_date' => 1000 - $i,
      ];
    }

    $response = new Response(
      200,
      ['Content-Type' => 'application/json'],
      json_encode(
        ['items' => $items],
        JSON_THROW_ON_ERROR
      )
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->method('request')
      ->willReturn($response);

    $client = $this->createClient($http_client);

    $questions = $client->getQuestions();

    $this->assertCount(20, $questions);
    $this->assertSame(1, $questions[0]['id']);
    $this->assertSame(20, $questions[19]['id']);
  }

  /**
   * Tests that no request is made when no tags are configured.
   */
  public function testGetQuestionsWithoutTags(): void {
    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->never())
      ->method('request');

    $client = $this->createClient($http_client);

    $this->assertSame(
      [],
      $client->getQuestions()
    );
  }

  /**
   * Tests that questions are returned from cache after the first request.
   */
  public function testGetQuestionsUsesCache(): void {
    Term::create([
      'vid' => 'stack_overflow_tags',
      'name' => 'Angular',
      'status' => 1,
      'field_stack_overflow_tag' => 'angular',
    ])->save();

    $api_response = [
      'items' => [
        [
          'question_id' => 12345,
          'title' => 'Angular question',
          'link' => 'https://stackoverflow.com/questions/12345',
          'tags' => ['angular'],
          'score' => 3,
          'answer_count' => 2,
          'is_answered' => TRUE,
          'last_activity_date' => 1234567890,
        ],
      ],
    ];

    $response = new Response(
      200,
      ['Content-Type' => 'application/json'],
      json_encode(
        $api_response,
        JSON_THROW_ON_ERROR
      )
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->once())
      ->method('request')
      ->willReturn($response);

    $client = $this->createClient($http_client);

    $first_result = $client->getQuestions();
    $second_result = $client->getQuestions();

    $this->assertSame(
      $first_result,
      $second_result
    );

    $this->assertCount(
      1,
      $second_result
    );

    $this->assertSame(
      12345,
      $second_result[0]['id']
    );
  }

}
