<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali\Functional;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\filter\Entity\FilterFormat;
use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\BrowserTestBase;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use Drupal\Tests\Traits\Core\PathAliasTestTrait;

/**
 * Verifica l'endpoint pubblico degli articoli per area.
 */
#[RunTestsInSeparateProcesses]
final class ArticlesEndpointTest extends BrowserTestBase {

  use PathAliasTestTrait;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'node',
    'text',
    'link',
    'filter',
    'weight',
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

    $html = NodeType::create([
      'type' => 'html',
      'name' => 'HTML',
    ]);
    $html->setThirdPartySetting('appunti_digitali', 'area', TRUE);
    $html->save();

    NodeType::create([
      'type' => 'page',
      'name' => 'Page',
    ])->save();

    FilterFormat::create([
      'format' => 'full_html',
      'name' => 'Full HTML',
      'filters' => [],
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_body',
      'entity_type' => 'node',
      'type' => 'text_long',
      'cardinality' => 1,
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_body',
      'entity_type' => 'node',
      'bundle' => 'html',
      'label' => 'Body',
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_approfondimenti',
      'entity_type' => 'node',
      'type' => 'link',
      'cardinality' => FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED,
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_approfondimenti',
      'entity_type' => 'node',
      'bundle' => 'html',
      'label' => 'Approfondimenti',
    ])->save();

    FieldStorageConfig::create([
      'field_name' => 'field_weight',
      'entity_type' => 'node',
      'type' => 'weight',
      'cardinality' => 1,
    ])->save();

    FieldConfig::create([
      'field_name' => 'field_weight',
      'entity_type' => 'node',
      'bundle' => 'html',
      'label' => 'Weight',
    ])->save();
  }

  /**
   * Verifica validazione, pubblicazione, ordinamento e normalizzazione.
   */
  public function testArticlesEndpoint(): void {
    $article_weight_10 = Node::create([
      'type' => 'html',
      'title' => 'Articolo HTML di prova',
      'status' => TRUE,
      'field_body' => [
        'value' => '<h2>Introduzione</h2><p>Primo articolo.</p>',
        'format' => 'full_html',
      ],
      'field_approfondimenti' => [
        [
          'uri' => 'https://developer.mozilla.org/en-US/docs/Web/HTML',
          'title' => 'MDN HTML',
        ],
      ],
      'field_weight' => 10,
    ]);
    $article_weight_10->save();
    $this->createPathAlias(
      '/node/' . $article_weight_10->id(),
      '/html/articolo-html-di-prova',
    );

    $article_weight_5 = Node::create([
      'type' => 'html',
      'title' => 'Secondo articolo HTML',
      'status' => TRUE,
      'field_body' => [
        'value' => '<p>Secondo articolo di prova.</p>',
        'format' => 'full_html',
      ],
      'field_weight' => 5,
    ]);
    $article_weight_5->save();
    $this->createPathAlias(
      '/node/' . $article_weight_5->id(),
      '/html/secondo-articolo-html',
    );

    Node::create([
      'type' => 'html',
      'title' => 'Articolo HTML non pubblicato',
      'status' => FALSE,
      'field_body' => [
        'value' => '<p>Questo articolo non deve comparire.</p>',
        'format' => 'full_html',
      ],
      'field_weight' => 0,
    ])->save();

    $this->drupalGet('/api/articles/html');

    $this->assertSession()->statusCodeEquals(200);

    $articles = json_decode(
      $this->getSession()->getPage()->getContent(),
      TRUE,
      512,
      JSON_THROW_ON_ERROR,
    );

    $this->assertCount(2, $articles);

    $this->assertSame((int) $article_weight_5->id(), $articles[0]['id']);
    $this->assertSame('Secondo articolo HTML', $articles[0]['title']);
    $this->assertSame(
      '/html/secondo-articolo-html',
      $articles[0]['path'],
    );
    $this->assertSame('html', $articles[0]['area']);
    $this->assertSame(
      '<p>Secondo articolo di prova.</p>',
      $articles[0]['body'],
    );
    $this->assertSame([], $articles[0]['externalLinks']);
    $this->assertSame(5, $articles[0]['weight']);

    $this->assertSame((int) $article_weight_10->id(), $articles[1]['id']);
    $this->assertSame('Articolo HTML di prova', $articles[1]['title']);
    $this->assertSame(
      '/html/articolo-html-di-prova',
      $articles[1]['path'],
    );
    $this->assertSame('html', $articles[1]['area']);
    $this->assertSame(
      '<h2>Introduzione</h2><p>Primo articolo.</p>',
      $articles[1]['body'],
    );
    $this->assertSame(
      [
        [
          'title' => 'MDN HTML',
          'url' => 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        ],
      ],
      $articles[1]['externalLinks'],
    );
    $this->assertSame(10, $articles[1]['weight']);

    $this->drupalGet('/api/articles/page');

    $this->assertSession()->statusCodeEquals(404);
    $this->assertSame(
      ['message' => 'Area not found.'],
      json_decode(
        $this->getSession()->getPage()->getContent(),
        TRUE,
        512,
        JSON_THROW_ON_ERROR,
      ),
    );

    $this->drupalGet('/api/articles/qualcosa');

    $this->assertSession()->statusCodeEquals(404);
    $this->assertSame(
      ['message' => 'Area not found.'],
      json_decode(
        $this->getSession()->getPage()->getContent(),
        TRUE,
        512,
        JSON_THROW_ON_ERROR,
      ),
    );
  }

}
