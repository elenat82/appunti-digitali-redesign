<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali\Controller;

use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\node\NodeTypeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Espone i path pubblici da includere nella sitemap.
 */
final class SitemapController implements ContainerInjectionInterface {

  /**
   * Costruisce il controller della sitemap.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Crea il controller tramite dependency injection.
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
    );
  }

  /**
   * Restituisce i path degli articoli pubblicati.
   */
  public function get(): CacheableJsonResponse {
    $node_type_storage =
      $this->entityTypeManager->getStorage('node_type');

    /** @var \Drupal\node\NodeTypeInterface[] $node_types */
    $node_types = $node_type_storage->loadMultiple();

    $area_ids = [];

    foreach ($node_types as $node_type) {
      if (
        $node_type instanceof NodeTypeInterface &&
        $node_type->getThirdPartySetting(
          'appunti_digitali',
          'area',
          FALSE,
        )
      ) {
        $area_ids[] = $node_type->id();
      }
    }

    $paths = [];

    if ($area_ids !== []) {
      $node_storage =
        $this->entityTypeManager->getStorage('node');

      $node_ids = $node_storage
        ->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', $area_ids, 'IN')
        ->condition('status', NodeInterface::PUBLISHED)
        ->execute();

      /** @var \Drupal\node\NodeInterface[] $nodes */
      $nodes = $node_storage->loadMultiple($node_ids);

      foreach ($nodes as $node) {
        $paths[] = $node->toUrl()->toString();
      }

      sort($paths);
    }

    $response = new CacheableJsonResponse([
      'paths' => $paths,
    ]);

    foreach ($node_types as $node_type) {
      $response->addCacheableDependency($node_type);
    }

    $node_definition =
      $this->entityTypeManager->getDefinition('node');

    foreach ($area_ids as $area_id) {
      $response
        ->getCacheableMetadata()
        ->addCacheTags(
          $node_definition
            ->getBundleListCacheTags($area_id),
        );
    }

    $response
      ->getCacheableMetadata()
      ->addCacheContexts(
        $node_definition->getListCacheContexts(),
      );

    return $response;
  }

}
