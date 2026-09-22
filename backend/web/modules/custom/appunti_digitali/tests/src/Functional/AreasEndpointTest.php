<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali\Functional;

use Drupal\node\Entity\NodeType;
use Drupal\Tests\BrowserTestBase;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Tests the thematic areas endpoint.
 *
 * @group appunti_digitali
 */
#[RunTestsInSeparateProcesses]
final class AreasEndpointTest extends BrowserTestBase {

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
   * Tests the public areas endpoint.
   */
  public function testAreasEndpoint(): void {
    $this->createNodeType(
      'javascript',
      'JavaScript',
      TRUE,
      'javascript.svg',
      2,
    );

    $this->createNodeType(
      'html',
      'HTML',
      TRUE,
      'html.svg',
      0,
    );

    $this->createNodeType(
      'css',
      'CSS',
      TRUE,
      'css.svg',
      1,
    );

    $this->createNodeType(
      'page',
      'Basic page',
      FALSE,
      'page.svg',
      10,
    );

    $this->drupalGet('/api/areas');

    $this->assertSession()->statusCodeEquals(200);

    $content = $this->getSession()->getPage()->getContent();
    $areas = json_decode($content, TRUE, 512, JSON_THROW_ON_ERROR);

    $this->assertCount(3, $areas);

    $this->assertSame(
      ['html', 'css', 'javascript'],
      array_column($areas, 'id'),
    );

    $this->assertSame('HTML', $areas[0]['label']);
    $this->assertSame(0, $areas[0]['weight']);

    $this->assertArrayHasKey('iconUrl', $areas[0]);
    $this->assertMatchesRegularExpression(
      '#^https?://#',
      $areas[0]['iconUrl'],
    );
    $this->assertStringEndsWith(
      '/modules/custom/appunti_digitali/assets/icons/html.svg',
      $areas[0]['iconUrl'],
    );
  }

  /**
   * Creates a node type with Appunti Digitali area settings.
   */
  private function createNodeType(
    string $id,
    string $label,
    bool $area,
    string $icon,
    int $weight,
  ): void {
    $node_type = NodeType::create([
      'type' => $id,
      'name' => $label,
    ]);

    $node_type->setThirdPartySetting(
      'appunti_digitali',
      'area',
      $area,
    );

    $node_type->setThirdPartySetting(
      'appunti_digitali',
      'icon',
      $icon,
    );

    $node_type->setThirdPartySetting(
      'appunti_digitali',
      'weight',
      $weight,
    );

    $node_type->save();
  }

}
