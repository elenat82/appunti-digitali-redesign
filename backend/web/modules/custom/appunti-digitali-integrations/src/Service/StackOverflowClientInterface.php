<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Service;

/**
 * Defines the contract for the Stack Overflow integration service.
 */
interface StackOverflowClientInterface {

  /**
   * Returns the configured Stack Overflow tags.
   *
   * @return string[]
   *   The Stack Overflow tags.
   */
  public function getTags(): array;

  /**
   * Returns recent Stack Overflow questions for the configured tags.
   *
   * @return array[]
   *   The normalized Stack Overflow questions.
   */
  public function getQuestions(): array;

}
