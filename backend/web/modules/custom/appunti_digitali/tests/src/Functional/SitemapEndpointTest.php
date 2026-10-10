<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali\Functional;

use Drupal\node\Entity\Node;
use Drupal\node\Entity\NodeType;
use Drupal\Tests\BrowserTestBase;
use Drupal\Tests\Traits\Core\PathAliasTestTrait;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Verifica l'endpoint pubblico utilizzato per generare la sitemap.
 */
#[RunTestsInSeparateProcesses]
final class SitemapEndpointTest extends BrowserTestBase {

  use PathAliasTestTrait;

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
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $html = NodeType::create([
      'type' => 'html',
      'name' => 'HTML',
    ]);

    $html->setThirdPartySetting(
      'appunti_digitali',
      'area',
      TRUE,
    );

    $html->save();

    NodeType::create([
      'type' => 'page',
      'name' => 'Page',
    ])->save();
  }

  /**
   * Verifica che la sitemap esponga solo articoli pubblicati delle aree.
   */
  public function testSitemapEndpoint(): void {
    $published_article = Node::create([
      'type' => 'html',
      'title' => 'Articolo HTML pubblicato',
      'status' => TRUE,
    ]);

    $published_article->save();

    $this->createPathAlias(
      '/node/' . $published_article->id(),
      '/appunti/html/articolo-html-pubblicato',
    );

    $unpublished_article = Node::create([
      'type' => 'html',
      'title' => 'Articolo HTML non pubblicato',
      'status' => FALSE,
    ]);

    $unpublished_article->save();

    $this->createPathAlias(
      '/node/' . $unpublished_article->id(),
      '/appunti/html/articolo-html-non-pubblicato',
    );

    $page = Node::create([
      'type' => 'page',
      'title' => 'Pagina non appartenente a un area',
      'status' => TRUE,
    ]);

    $page->save();

    $this->createPathAlias(
      '/node/' . $page->id(),
      '/pagina-generica',
    );

    $this->drupalGet('/api/sitemap');

    $this->assertSession()->statusCodeEquals(200);

    $response = json_decode(
      $this->getSession()->getPage()->getContent(),
      TRUE,
      512,
      JSON_THROW_ON_ERROR,
    );

    $this->assertSame(
      [
        'paths' => [
          '/appunti/html/articolo-html-pubblicato',
        ],
      ],
      $response,
    );
  }

}
