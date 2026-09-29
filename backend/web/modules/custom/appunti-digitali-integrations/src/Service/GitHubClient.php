<?php

namespace Drupal\appunti_digitali_integrations\Service;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\user\UserInterface;
use GuzzleHttp\ClientInterface;

/**
 * Retrieves starred repositories from GitHub.
 */
class GitHubClient implements GitHubClientInterface {

  /**
   * GitHub API endpoint.
   */
  private const API_URL = 'https://api.github.com/users/%s/starred';

  /**
   * Maximum number of repositories requested per page.
   */
  private const PAGE_SIZE = 100;

  /**
   * Cache lifetime in seconds.
   */
  private const CACHE_MAX_AGE = 3600;

  /**
   * Cache key prefix.
   */
  private const CACHE_PREFIX =
  'appunti_digitali_integrations:github:starred:';

  /**
   * Constructs the GitHub client.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly ClientInterface $httpClient,
    private readonly CacheBackendInterface $cache,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function getStarredRepositories(): array {
    $username = $this->getGitHubUsername();

    $cache_id =
      self::CACHE_PREFIX .
      hash('sha256', $username);

    if ($cached = $this->cache->get($cache_id)) {
      return $cached->data;
    }

    $repositories = [];
    $page = 1;

    do {
      $response = $this->httpClient->request(
        'GET',
        sprintf(
          self::API_URL,
          rawurlencode($username)
        ),
        [
          'headers' => [
            'Accept' => 'application/vnd.github+json',
            'User-Agent' => 'Appunti-Digitali',
          ],
          'query' => [
            'sort' => 'created',
            'direction' => 'desc',
            'per_page' => self::PAGE_SIZE,
            'page' => $page,
          ],
        ]
      );

      $data = json_decode(
        (string) $response->getBody(),
        TRUE,
        512,
        JSON_THROW_ON_ERROR
      );

      if (!is_array($data)) {
        break;
      }

      foreach ($data as $repository) {
        $repositories[] = [
          'id' => $repository['id'],
          'name' => $repository['name'],
          'fullName' => $repository['full_name'],
          'url' => $repository['html_url'],
          'description' =>
          $repository['description'] ?? NULL,
          'language' =>
          $repository['language'] ?? NULL,
          'stars' =>
          $repository['stargazers_count'] ?? 0,
          'topics' =>
          $repository['topics'] ?? [],
        ];
      }

      $page++;
    } while (count($data) === self::PAGE_SIZE);

    $this->cache->set(
      $cache_id,
      $repositories,
      time() + self::CACHE_MAX_AGE
    );

    return $repositories;
  }

  /**
   * Gets the GitHub username of the public profile.
   */
  private function getGitHubUsername(): string {
    $storage = $this->entityTypeManager
      ->getStorage('user');

    $user_ids = $storage
      ->getQuery()
      ->condition('status', 1)
      ->condition('roles', 'public_profile')
      ->accessCheck(FALSE)
      ->range(0, 2)
      ->execute();

    if (count($user_ids) !== 1) {
      throw new \UnexpectedValueException(
        'Exactly one active user must have the public_profile role.'
      );
    }

    $user = $storage->load(reset($user_ids));

    if (!$user instanceof UserInterface) {
      throw new \UnexpectedValueException(
        'The public profile user could not be loaded.'
      );
    }

    $username = trim(
      $user
        ->get('field_github_username')
        ->getString()
    );

    if ($username === '') {
      throw new \UnexpectedValueException(
        'The public profile user does not have a GitHub username.'
      );
    }

    return $username;
  }

}
