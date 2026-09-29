<?php

namespace Drupal\Tests\appunti_digitali_integrations\Kernel;

use Drupal\Core\Cache\MemoryBackend;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\KernelTests\KernelTestBase;
use Drupal\appunti_digitali_integrations\Service\GitHubClient;
use Drupal\user\Entity\Role;
use Drupal\user\Entity\User;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the GitHub client.
 */
#[RunTestsInSeparateProcesses]
class GitHubClientTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'system',
    'user',
    'field',
    'taxonomy',
    'appunti_digitali_integrations',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->installEntitySchema('user');
    $this->installConfig(['user']);

    Role::create([
      'id' => 'public_profile',
      'label' => 'Public profile',
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_github_username',
      'entity_type' => 'user',
      'type' => 'string',
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_github_username',
      'entity_type' => 'user',
      'bundle' => 'user',
      'label' => 'GitHub username',
    ])->save();
  }

  /**
   * Tests repository normalization.
   */
  public function testGetStarredRepositories(): void {
    $this->createPublicProfileUser(
      'profile',
      'elenat82'
    );

    $response = new Response(
      200,
      [],
      json_encode([
        [
          'id' => 101,
          'name' => 'project-one',
          'full_name' => 'example/project-one',
          'html_url' =>
          'https://github.com/example/project-one',
          'description' => 'First project.',
          'language' => 'PHP',
          'stargazers_count' => 15,
          'topics' => ['drupal', 'php'],
        ],
        [
          'id' => 102,
          'name' => 'project-two',
          'full_name' => 'example/project-two',
          'html_url' =>
          'https://github.com/example/project-two',
          'description' => NULL,
          'language' => NULL,
          'stargazers_count' => 7,
        ],
      ], JSON_THROW_ON_ERROR)
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->once())
      ->method('request')
      ->with(
        'GET',
        'https://api.github.com/users/elenat82/starred',
        $this->callback(
          static function (array $options): bool {
            return $options['query']['sort'] === 'created' &&
              $options['query']['direction'] === 'desc' &&
              $options['query']['per_page'] === 100 &&
              $options['query']['page'] === 1;
          }
        )
      )
      ->willReturn($response);

    $client = $this->createClient($http_client);

    $this->assertSame(
      [
        [
          'id' => 101,
          'name' => 'project-one',
          'fullName' => 'example/project-one',
          'url' =>
          'https://github.com/example/project-one',
          'description' => 'First project.',
          'language' => 'PHP',
          'stars' => 15,
          'topics' => ['drupal', 'php'],
        ],
        [
          'id' => 102,
          'name' => 'project-two',
          'fullName' => 'example/project-two',
          'url' =>
          'https://github.com/example/project-two',
          'description' => NULL,
          'language' => NULL,
          'stars' => 7,
          'topics' => [],
        ],
      ],
      $client->getStarredRepositories()
    );
  }

  /**
   * Tests that an active public profile user is used.
   */
  public function testUsesActivePublicProfileUser(): void {
    $inactive_user = $this->createPublicProfileUser(
      'inactive-profile',
      'inactive-user',
      FALSE
    );

    $active_user = $this->createPublicProfileUser(
      'active-profile',
      'active-user'
    );

    $this->assertFalse($inactive_user->isActive());
    $this->assertTrue($active_user->isActive());

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->once())
      ->method('request')
      ->with(
        'GET',
        'https://api.github.com/users/active-user/starred',
        $this->anything()
      )
      ->willReturn(
        new Response(
          200,
          [],
          json_encode([], JSON_THROW_ON_ERROR)
        )
      );

    $client = $this->createClient($http_client);

    $this->assertSame(
      [],
      $client->getStarredRepositories()
    );
  }

  /**
   * Tests the behavior when no public profile user exists.
   */
  public function testMissingPublicProfileUser(): void {
    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->never())
      ->method('request');

    $client = $this->createClient($http_client);

    $this->expectException(
      \UnexpectedValueException::class
    );

    $this->expectExceptionMessage(
      'Exactly one active user must have the public_profile role.'
    );

    $client->getStarredRepositories();
  }

  /**
   * Tests the behavior when multiple public profile users exist.
   */
  public function testMultiplePublicProfileUsers(): void {
    $this->createPublicProfileUser(
      'profile-one',
      'user-one'
    );

    $this->createPublicProfileUser(
      'profile-two',
      'user-two'
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->never())
      ->method('request');

    $client = $this->createClient($http_client);

    $this->expectException(
      \UnexpectedValueException::class
    );

    $this->expectExceptionMessage(
      'Exactly one active user must have the public_profile role.'
    );

    $client->getStarredRepositories();
  }

  /**
   * Tests the behavior when the GitHub username is missing.
   */
  public function testMissingGitHubUsername(): void {
    $this->createPublicProfileUser(
      'profile',
      ''
    );

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->never())
      ->method('request');

    $client = $this->createClient($http_client);

    $this->expectException(
      \UnexpectedValueException::class
    );

    $this->expectExceptionMessage(
      'The public profile user does not have a GitHub username.'
    );

    $client->getStarredRepositories();
  }

  /**
   * Tests that all pages of starred repositories are retrieved.
   */
  public function testPagination(): void {
    $this->createPublicProfileUser(
      'profile',
      'elenat82'
    );

    $first_page = [];

    for ($i = 1; $i <= 100; $i++) {
      $first_page[] = $this->createRepositoryData(
        $i
      );
    }

    $second_page = [
      $this->createRepositoryData(101),
      $this->createRepositoryData(102),
    ];

    $responses = [
      new Response(
        200,
        [],
        json_encode(
          $first_page,
          JSON_THROW_ON_ERROR
        )
      ),
      new Response(
        200,
        [],
        json_encode(
          $second_page,
          JSON_THROW_ON_ERROR
        )
      ),
    ];

    $request_number = 0;

    $http_client = $this->createMock(
      ClientInterface::class
    );

    $http_client
      ->expects($this->exactly(2))
      ->method('request')
      ->willReturnCallback(
        function (
          string $method,
          string $url,
          array $options,
        ) use (
          &$request_number,
          $responses
        ): Response {
          $this->assertSame('GET', $method);
          $this->assertSame(
            'https://api.github.com/users/elenat82/starred',
            $url
          );

          $request_number++;

          $this->assertSame(
            $request_number,
            $options['query']['page']
          );

          return $responses[$request_number - 1];
        }
      );

    $client = $this->createClient($http_client);

    $repositories =
      $client->getStarredRepositories();

    $this->assertCount(102, $repositories);
    $this->assertSame(
      1,
      $repositories[0]['id']
    );
    $this->assertSame(
      102,
      $repositories[101]['id']
    );
  }

  /**
   * Tests that cached repositories avoid duplicate HTTP requests.
   */
  public function testCacheReuse(): void {
    $this->createPublicProfileUser(
      'profile',
      'elenat82'
    );

    $response = new Response(
      200,
      [],
      json_encode(
        [
          $this->createRepositoryData(1),
        ],
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

    $first_result =
      $client->getStarredRepositories();

    $second_result =
      $client->getStarredRepositories();

    $this->assertSame(
      $first_result,
      $second_result
    );

    $this->assertCount(
      1,
      $second_result
    );
  }

  /**
   * Creates a GitHub client for the test.
   */
  private function createClient(
    ClientInterface $http_client,
  ): GitHubClient {
    return new GitHubClient(
      $this->container->get(
        'entity_type.manager'
      ),
      $http_client,
      new MemoryBackend(
        $this->container->get(
          'datetime.time'
        )
      ),
    );
  }

  /**
   * Creates a public profile user.
   */
  private function createPublicProfileUser(
    string $name,
    string $github_username,
    bool $active = TRUE,
  ): User {
    $user = User::create([
      'name' => $name,
      'status' => $active,
      'roles' => ['public_profile'],
      'field_github_username' =>
      $github_username,
    ]);

    $user->save();

    return $user;
  }

  /**
   * Creates repository data returned by GitHub.
   */
  private function createRepositoryData(
    int $id,
  ): array {
    return [
      'id' => $id,
      'name' => "repository-$id",
      'full_name' => "example/repository-$id",
      'html_url' =>
      "https://github.com/example/repository-$id",
      'description' => "Repository $id",
      'language' => 'PHP',
      'stargazers_count' => $id,
      'topics' => ['test'],
    ];
  }

}
