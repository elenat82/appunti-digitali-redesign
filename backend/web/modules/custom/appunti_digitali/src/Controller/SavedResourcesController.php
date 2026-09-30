<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\taxonomy\TermInterface;

/**
 * Provides the public saved resources API endpoint.
 */
final class SavedResourcesController extends ControllerBase {

  /**
   * Constructs a SavedResourcesController object.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManagerService,
  ) {}

  /**
   * Returns the published saved resources.
   */
  public function getResources(): JsonResponse {
    $storage = $this->entityTypeManagerService
      ->getStorage('node');

    $ids = $storage
      ->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'saved_resource')
      ->condition('status', NodeInterface::PUBLISHED)
      ->sort('created', 'DESC')
      ->execute();

    $nodes = $storage->loadMultiple($ids);

    $resources = [];

    /** @var \Drupal\node\NodeInterface $node */
    foreach ($nodes as $node) {
      /** @var \Drupal\Core\Field\EntityReferenceFieldItemList $tags_field */
      $tags_field = $node->get('field_tags');

      $tags = array_map(
        static fn(TermInterface $term): string => $term->label(),
        $tags_field->referencedEntities()
      );

      $resources[] = [
        'id' => (int) $node->id(),
        'title' => $node->label(),
        'url' => (string) $node->get('field_url')->uri,
        'tags' => $tags,
      ];
    }

    return new JsonResponse($resources);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(
    ContainerInterface $container,
  ): static {
    return new static(
      $container->get('entity_type.manager')
    );
  }

}
