<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali\Functional;

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\Tests\BrowserTestBase;
use Drupal\user\Entity\Role;
use Drupal\user\RoleInterface;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the saved resources endpoint.
 *
 * @group appunti_digitali
 */
#[RunTestsInSeparateProcesses]
final class SavedResourcesEndpointTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'field',
    'link',
    'taxonomy',
    'appunti_digitali',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->createSavedResourceModel();

    $anonymous_role = Role::load(
      RoleInterface::ANONYMOUS_ID
    );

    $anonymous_role?->grantPermission(
      'access content'
    );

    $anonymous_role?->save();
  }

  /**
   * Tests that an empty collection is returned without resources.
   */
  public function testEmptySavedResourcesEndpoint(): void {
    $this->drupalGet('/api/saved-resources');

    $this->assertSession()->statusCodeEquals(200);

    $resources = $this->getJsonResponse();

    $this->assertSame([], $resources);
  }

  /**
   * Tests normalization, publication filtering, tags and ordering.
   */
  public function testSavedResourcesEndpoint(): void {
    $drupal = Term::create([
      'vid' => 'tag_risorse_salvate',
      'name' => 'Drupal',
    ]);
    $drupal->save();

    $php = Term::create([
      'vid' => 'tag_risorse_salvate',
      'name' => 'PHP',
    ]);
    $php->save();

    $angular = Term::create([
      'vid' => 'tag_risorse_salvate',
      'name' => 'Angular',
    ]);
    $angular->save();

    $older = Node::create([
      'type' => 'saved_resource',
      'title' => 'Older resource',
      'status' => TRUE,
      'created' => 100,
      'field_url' => [
        'uri' => 'https://example.com/older',
      ],
      'field_tags' => [
        ['target_id' => $drupal->id()],
        ['target_id' => $php->id()],
      ],
    ]);
    $older->save();

    Node::create([
      'type' => 'saved_resource',
      'title' => 'Unpublished resource',
      'status' => FALSE,
      'created' => 500,
      'field_url' => [
        'uri' => 'https://example.com/unpublished',
      ],
      'field_tags' => [
        ['target_id' => $php->id()],
      ],
    ])->save();

    $newer = Node::create([
      'type' => 'saved_resource',
      'title' => 'Newer resource',
      'status' => TRUE,
      'created' => 300,
      'field_url' => [
        'uri' => 'https://example.com/newer',
      ],
      'field_tags' => [
        ['target_id' => $drupal->id()],
        ['target_id' => $angular->id()],
      ],
    ]);
    $newer->save();

    $this->drupalGet('/api/saved-resources');

    $this->assertSession()->statusCodeEquals(200);

    $resources = $this->getJsonResponse();

    $this->assertCount(2, $resources);

    $this->assertSame(
      [
        (int) $newer->id(),
        (int) $older->id(),
      ],
      array_column($resources, 'id')
    );

    $this->assertSame(
      [
        'id' => (int) $newer->id(),
        'title' => 'Newer resource',
        'url' => 'https://example.com/newer',
        'tags' => [
          'Drupal',
          'Angular',
        ],
      ],
      $resources[0]
    );

    $this->assertSame(
      [
        'id' => (int) $older->id(),
        'title' => 'Older resource',
        'url' => 'https://example.com/older',
        'tags' => [
          'Drupal',
          'PHP',
        ],
      ],
      $resources[1]
    );
  }

  /**
   * Creates the saved resource content model used by the tests.
   */
  private function createSavedResourceModel(): void {
    NodeType::create([
      'type' => 'saved_resource',
      'name' => 'Risorsa salvata',
    ])->save();

    Vocabulary::create([
      'vid' => 'tag_risorse_salvate',
      'name' => 'Tag risorse salvate',
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_url',
      'entity_type' => 'node',
      'type' => 'link',
      'cardinality' => 1,
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_url',
      'entity_type' => 'node',
      'bundle' => 'saved_resource',
      'label' => 'URL',
      'required' => TRUE,
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_tags',
      'entity_type' => 'node',
      'type' => 'entity_reference',
      'cardinality' => -1,
      'settings' => [
        'target_type' => 'taxonomy_term',
      ],
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_tags',
      'entity_type' => 'node',
      'bundle' => 'saved_resource',
      'label' => 'Tags',
      'settings' => [
        'handler' => 'default:taxonomy_term',
        'handler_settings' => [
          'target_bundles' => [
            'tag_risorse_salvate' =>
            'tag_risorse_salvate',
          ],
        ],
      ],
    ])->save();
  }

  /**
   * Decodes the current JSON response.
   */
  private function getJsonResponse(): array {
    $content = $this->getSession()
      ->getPage()
      ->getContent();

    return json_decode(
      $content,
      TRUE,
      512,
      JSON_THROW_ON_ERROR
    );
  }

}
