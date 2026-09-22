<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali\Functional;

use Drupal\node\Entity\NodeType;
use Drupal\node\NodeTypeInterface;
use Drupal\Tests\BrowserTestBase;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the thematic area settings on node type forms.
 *
 * @group appunti_digitali
 */
#[RunTestsInSeparateProcesses]
final class AreaSettingsFormTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'appunti_digitali',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * Tests that thematic area settings are saved on the node type.
   */
  public function testAreaSettingsAreSaved(): void {
    $node_type = NodeType::create([
      'type' => 'test_area',
      'name' => 'Test area',
    ]);
    $node_type->save();

    $admin = $this->drupalCreateUser([
      'administer content types',
    ]);
    $this->drupalLogin($admin);

    $this->drupalGet('/admin/structure/types/manage/test_area');

    $this->assertSession()->statusCodeEquals(200);

    $this->submitForm([
      'appunti_digitali[area]' => TRUE,
      'appunti_digitali[icon]' => 'test.svg',
      'appunti_digitali[weight]' => 12,
    ], 'op');

    $storage = $this->container
      ->get('entity_type.manager')
      ->getStorage('node_type');

    $storage->resetCache(['test_area']);

    /** @var \Drupal\node\NodeTypeInterface|null $saved_node_type */
    $saved_node_type = $storage->load('test_area');

    $this->assertInstanceOf(
      NodeTypeInterface::class,
      $saved_node_type,
    );

    $this->assertTrue(
      $saved_node_type->getThirdPartySetting(
        'appunti_digitali',
        'area',
        FALSE,
      ),
    );

    $this->assertSame(
      'test.svg',
      $saved_node_type->getThirdPartySetting(
        'appunti_digitali',
        'icon',
      ),
    );

    $this->assertSame(
      12,
      $saved_node_type->getThirdPartySetting(
        'appunti_digitali',
        'weight',
      ),
    );
  }

}
