<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_integrations\Controller;

use Drupal\appunti_digitali_integrations\Service\NewsServiceInterface;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Provides the news API endpoint.
 */
final class NewsController extends ControllerBase {

  /**
   * Constructs a NewsController object.
   */
  public function __construct(
    private readonly NewsServiceInterface $newsService,
  ) {}

  /**
   * Returns the latest news from the configured RSS sources.
   */
  public function getNews(): JsonResponse {
    return new JsonResponse(
      $this->newsService->getNews()
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
        'appunti_digitali_integrations.news_service'
      )
    );
  }

}
