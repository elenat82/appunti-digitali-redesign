<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_migrate\Plugin\migrate\process;

use Drupal\migrate\Attribute\MigrateProcess;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Transforms legacy article body markup for Drupal 11.
 *
 * Converts legacy CodePen markup to the format used by the new frontend while preserving the remaining body HTML unchanged.
 */
#[MigrateProcess('appunti_digitali_transform_legacy_body')]
final class TransformLegacyBody extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform(
    $value,
    MigrateExecutableInterface $migrate_executable,
    Row $row,
    $destination_property,
  ) {
    if (!is_string($value) || $value === '') {
      return $value;
    }

    $codepen_depth = 0;

    return preg_replace_callback(
      '/<\/?div\b[^>]*>|<pre\b[^>]*>/i',
      static function (array $matches) use (&$codepen_depth): string {
        $tag = $matches[0];

        if (preg_match('/^<\/div\b/i', $tag)) {
          if ($codepen_depth > 0) {
            $codepen_depth--;
          }

          return $tag;
        }

        if (preg_match('/^<div\b/i', $tag)) {
          if ($codepen_depth > 0) {
            $codepen_depth++;
            return $tag;
          }

          if (!preg_match(
            '/\bclass\s*=\s*(["\'])(.*?)\1/i',
            $tag,
            $class_match,
          )) {
            return $tag;
          }

          $classes = preg_split(
            '/\s+/',
            trim($class_match[2]),
          ) ?: [];

          $penny_index = array_search('penny', $classes, TRUE);

          if ($penny_index === FALSE) {
            return $tag;
          }

          $classes[$penny_index] = 'codepen-demo';

          $tag = preg_replace_callback(
            '/\bclass\s*=\s*(["\'])(.*?)\1/i',
            static fn(array $matches): string =>
              'class=' . $matches[1] . implode(' ', $classes) . $matches[1],
            $tag,
            1,
          ) ?? $tag;

          if (!preg_match('/\bdata-prefill\b/i', $tag)) {
            $tag = substr($tag, 0, -1) . ' data-prefill>';
          }

          $codepen_depth = 1;

          return $tag;
        }

        if ($codepen_depth > 0 && preg_match('/^<pre\b/i', $tag)) {
          return preg_replace(
            '/\bdata-option-autoprefixer\b/i',
            'data-options-autoprefixer',
            $tag,
          ) ?? $tag;
        }

        return $tag;
      },
      $value,
    ) ?? $value;
  }

}
