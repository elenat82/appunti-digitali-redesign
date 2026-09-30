<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Service;

/**
 * Defines the interface for the news service.
 */
interface NewsServiceInterface {

  /**
   * Retrieves the latest news from the configured RSS sources.
   *
   * @return array
   *   The normalized news items.
   */
  public function getNews(): array;

}
