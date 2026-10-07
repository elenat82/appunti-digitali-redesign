<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_migrate\Plugin\migrate\source;

use Drupal\migrate\Attribute\MigrateSource;
use Drupal\migrate\Plugin\migrate\source\SqlBase;

/**
 * Provides RSS feed sources from the legacy Drupal 8 database.
 *
 * Reads the Aggregator feed configuration that must be migrated to Drupal 11.
 */
#[MigrateSource('appunti_digitali_legacy_aggregator_feed')]
final class LegacyAggregatorFeed extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    return $this->select('aggregator_feed', 'f')
      ->fields('f', [
        'fid',
        'langcode',
        'title',
        'url',
        'refresh',
      ]);
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'fid' => $this->t('Legacy feed ID'),
      'langcode' => $this->t('Feed language code'),
      'title' => $this->t('Feed title'),
      'url' => $this->t('Feed URL'),
      'refresh' => $this->t('Refresh interval'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'fid' => [
        'type' => 'integer',
        'alias' => 'f',
      ],
    ];
  }

}
