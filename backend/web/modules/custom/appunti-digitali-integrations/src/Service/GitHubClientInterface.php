<?php

namespace Drupal\appunti_digitali_integrations\Service;

/**
 * Defines the interface for the GitHub client.
 */
interface GitHubClientInterface {

  /**
   * Retrieves all starred repositories for the public profile GitHub user.
   *
   * @return array
   *   The normalized starred repositories.
   */
  public function getStarredRepositories(): array;

}
