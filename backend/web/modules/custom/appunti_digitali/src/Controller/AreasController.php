<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali\Controller;

use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ExtensionPathResolver;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns the thematic areas exposed by Appunti Digitali.
 */
final class AreasController implements ContainerInjectionInterface {

  /**
   * Constructs an AreasController object.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly ExtensionPathResolver $extensionPathResolver,
  ) {}

  /**
   * Creates the controller.
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('extension.path.resolver'),
    );
  }

  /**
   * Returns the thematic areas.
   */
  public function get(): CacheableJsonResponse {
    $storage = $this->entityTypeManager->getStorage('node_type');

    /** @var NodeTypeInterface[] $node_types */
    $node_types = $storage->loadMultiple();

    $module_path = $this->extensionPathResolver->getPath(
      'module',
      'appunti_digitali',
    );

    $areas = [];

    foreach ($node_types as $node_type) {
      if (!$node_type->getThirdPartySetting('appunti_digitali', 'area', FALSE)) {
        continue;
      }

      $icon = (string) $node_type->getThirdPartySetting(
        'appunti_digitali',
        'icon',
        '',
      );

      $weight = (int) $node_type->getThirdPartySetting(
        'appunti_digitali',
        'weight',
        0,
      );

      $areas[] = [
        'id' => $node_type->id(),
        'label' => $node_type->label(),
        'iconUrl' => Url::fromUri(
          'base:' . $module_path . '/assets/icons/' . $icon,
          ['absolute' => TRUE],
        )->toString(),
        'weight' => $weight,
      ];
    }

    usort(
      $areas,
      static fn(array $a, array $b): int =>
        [$a['weight'], $a['id']] <=> [$b['weight'], $b['id']],
    );

    $response = new CacheableJsonResponse($areas);

    foreach ($node_types as $node_type) {
      $response->addCacheableDependency($node_type);
    }

    $response->getCacheableMetadata()->addCacheTags(
      $this->entityTypeManager
        ->getDefinition('node_type')
        ->getListCacheTags(),
    );

    return $response;
  }

}
