<?php

declare(strict_types=1);

namespace Drupal\Tests\appunti_digitali_migrate\Unit\Plugin\migrate\process;

use Drupal\appunti_digitali_migrate\Plugin\migrate\process\TransformLegacyBody;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Row;
use Drupal\Tests\UnitTestCase;
use PHPUnit\Framework\Attributes\Group;

/**
 * Tests the legacy body migrate process plugin.
 */
#[Group('appunti_digitali_migrate')]
final class TransformLegacyBodyTest extends UnitTestCase {

  /**
   * The process plugin under test.
   */
  private TransformLegacyBody $plugin;

  /**
   * The migrate executable.
   */
  private MigrateExecutableInterface $migrateExecutable;

  /**
   * The migration row.
   */
  private Row $row;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->plugin = new TransformLegacyBody(
      [],
      'appunti_digitali_transform_legacy_body',
      [],
    );

    $this->migrateExecutable = $this->createStub(
      MigrateExecutableInterface::class,
    );

    $this->row = new Row([], []);
  }

  /**
   * Tests conversion of the legacy CodePen wrapper.
   */
  public function testTransformsCodePenWrapper(): void {
    $input = '<p>Prima</p>'
      . '<div class="penny">'
      . '<pre data-lang="html">&lt;button&gt;Ok&lt;/button&gt;</pre>'
      . '</div>'
      . '<p>Dopo</p>';

    $expected = '<p>Prima</p>'
      . '<div class="codepen-demo" data-prefill>'
      . '<pre data-lang="html">&lt;button&gt;Ok&lt;/button&gt;</pre>'
      . '</div>'
      . '<p>Dopo</p>';

    $this->assertSame($expected, $this->transform($input));
  }

  /**
   * Tests conversion of the legacy Autoprefixer option.
   */
  public function testTransformsAutoprefixerOption(): void {
    $input = '<div class="penny">'
      . '<pre data-lang="css" data-option-autoprefixer="true">'
      . '.example { display: flex; }'
      . '</pre>'
      . '</div>';

    $expected = '<div class="codepen-demo" data-prefill>'
      . '<pre data-lang="css" data-options-autoprefixer="true">'
      . '.example { display: flex; }'
      . '</pre>'
      . '</div>';

    $this->assertSame($expected, $this->transform($input));
  }

  /**
   * Tests transformation of multiple CodePen embeds in the same body.
   */
  public function testTransformsMultipleCodePens(): void {
    $input = '<div class="penny">'
      . '<pre data-lang="html">one</pre>'
      . '</div>'
      . '<p>Testo</p>'
      . '<div class="penny">'
      . '<pre data-lang="js">two</pre>'
      . '</div>';

    $expected = '<div class="codepen-demo" data-prefill>'
      . '<pre data-lang="html">one</pre>'
      . '</div>'
      . '<p>Testo</p>'
      . '<div class="codepen-demo" data-prefill>'
      . '<pre data-lang="js">two</pre>'
      . '</div>';

    $this->assertSame($expected, $this->transform($input));
  }

  /**
   * Tests that HTML without CodePen markup remains unchanged.
   */
  public function testPreservesBodyWithoutCodePen(): void {
    $input = '<p>Testo normale.</p>'
      . '<pre data-lang="php">&lt;?php echo "test";</pre>';

    $this->assertSame($input, $this->transform($input));
  }

  /**
   * Tests that similarly named attributes outside CodePen are untouched.
   */
  public function testPreservesAutoprefixerOutsideCodePen(): void {
    $input = '<pre data-option-autoprefixer="true">test</pre>';

    $this->assertSame($input, $this->transform($input));
  }

  /**
   * Tests that escaped demo HTML remains unchanged.
   */
  public function testPreservesEscapedCode(): void {
    $input = '<div class="penny">'
      . '<pre data-lang="html">'
      . '&lt;div data-option-autoprefixer="true" class="penny"&gt;'
      . '&lt;/div&gt;'
      . '</pre>'
      . '</div>';

    $expected = '<div class="codepen-demo" data-prefill>'
      . '<pre data-lang="html">'
      . '&lt;div data-option-autoprefixer="true" class="penny"&gt;'
      . '&lt;/div&gt;'
      . '</pre>'
      . '</div>';

    $this->assertSame($expected, $this->transform($input));
  }

  /**
   * Runs the process plugin.
   */
  private function transform(string $value): mixed {
    return $this->plugin->transform(
      $value,
      $this->migrateExecutable,
      $this->row,
      'field_body/value',
    );
  }

}
