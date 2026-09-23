<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali\Controller;

use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\link\Plugin\Field\FieldType\LinkItem;
use Drupal\node\NodeInterface;
use Drupal\node\NodeTypeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\text\Plugin\Field\FieldType\TextLongItem;

/**
 * Espone gli articoli pubblicati appartenenti a un'area tematica.
 */
final class ArticlesController implements ContainerInjectionInterface {

  /**
   * Costruisce il controller degli articoli.
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
   * Restituisce gli articoli pubblicati appartenenti all'area richiesta.
   */
  public function get(string $area): CacheableJsonResponse {
    $node_type_storage = $this->entityTypeManager->getStorage('node_type');

    /** @var \Drupal\node\NodeTypeInterface|null $node_type */
    $node_type = $node_type_storage->load($area);

    if (
      !$node_type instanceof NodeTypeInterface ||
      !$node_type->getThirdPartySetting(
        'appunti_digitali',
        'area',
        FALSE,
      )
    ) {
      $response = new CacheableJsonResponse(
        ['message' => 'Area not found.'],
        404,
      );

      if ($node_type instanceof NodeTypeInterface) {
        $response->addCacheableDependency($node_type);
      }
      else {
        $response->getCacheableMetadata()->addCacheTags(
          $this->entityTypeManager
            ->getDefinition('node_type')
            ->getListCacheTags(),
        );
      }

      return $response;
    }

    $node_storage = $this->entityTypeManager->getStorage('node');

    $node_ids = $node_storage
      ->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', $area)
      ->condition('status', NodeInterface::PUBLISHED)
      ->sort('field_weight', 'ASC')
      ->sort('nid', 'ASC')
      ->execute();

    /** @var \Drupal\node\NodeInterface[] $nodes */
    $nodes = $node_storage->loadMultiple($node_ids);

    $articles = [];
    $cache_dependencies = [$node_type];

    foreach ($nodes as $node) {
      $body = '';

      if (!$node->get('field_body')->isEmpty()) {
        $body_item = $node->get('field_body')->first();

        if ($body_item instanceof TextLongItem) {
          $processed_body = $body_item->get('processed');

          $body = (string) $processed_body->getValue();
          $cache_dependencies[] = $processed_body;
        }
      }

      $external_links = [];

      foreach ($node->get('field_approfondimenti') as $link_item) {
        if (!$link_item instanceof LinkItem) {
          continue;
        }

        $external_links[] = [
          'title' => (string) $link_item->title,
          'url' => $link_item->getUrl()->toString(),
        ];
      }

      $articles[] = [
        'id' => (int) $node->id(),
        'title' => $node->label(),
        'area' => $area,
        'body' => $body,
        'externalLinks' => $external_links,
        'weight' => (int) ($node->get('field_weight')->value ?? 0),
      ];

      $cache_dependencies[] = $node;
    }

    $response = new CacheableJsonResponse($articles);

    foreach ($cache_dependencies as $dependency) {
      $response->addCacheableDependency($dependency);
    }

    $node_definition = $this->entityTypeManager->getDefinition('node');

    $response->getCacheableMetadata()->addCacheTags(
      $node_definition->getBundleListCacheTags($area),
    );

    $response->getCacheableMetadata()->addCacheContexts(
      $node_definition->getListCacheContexts(),
    );

    return $response;
  }

}
