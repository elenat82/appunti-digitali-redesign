<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Controller;

use Drupal\appunti_digitali_integrations\Service\StackOverflowClientInterface;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Provides the Stack Overflow API endpoint.
 */
final class StackOverflowController extends ControllerBase {

  /**
   * Constructs a StackOverflowController object.
   */
  public function __construct(
    private readonly StackOverflowClientInterface $stackOverflowClient,
  ) {}

  /**
   * Returns the Stack Overflow questions.
   */
  public function getQuestions(): JsonResponse {
    return new JsonResponse(
      $this->stackOverflowClient->getQuestions()
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
        'appunti_digitali_integrations.stack_overflow_client'
      )
    );
  }

}
