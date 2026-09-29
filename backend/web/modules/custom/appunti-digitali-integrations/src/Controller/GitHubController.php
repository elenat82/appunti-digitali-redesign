<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Controller;

use Drupal\appunti_digitali_integrations\Service\GitHubClientInterface;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Provides the GitHub API endpoint.
 */
final class GitHubController extends ControllerBase {

  /**
   * Constructs a GitHubController object.
   */
  public function __construct(
    private readonly GitHubClientInterface $gitHubClient,
  ) {}

  /**
   * Returns the starred GitHub repositories.
   */
  public function getStarredRepositories(): JsonResponse {
    return new JsonResponse(
      $this->gitHubClient->getStarredRepositories()
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
  ): static {
    return new static(
      $container->get(
        'appunti_digitali_integrations.github_client'
      )
    );
  }

}
