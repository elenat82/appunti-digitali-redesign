<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_migrate\Plugin\migrate\source;

use Drupal\migrate\Attribute\MigrateSource;
use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 * Provides technical articles from the legacy Drupal 8 database.
 *
 * Reads the technical content types that must be migrated to Drupal 11 and
 * exposes their body, publication status, ordering, and external links.
 */
#[MigrateSource('appunti_digitali_legacy_technical_article')]
final class LegacyTechnicalArticle extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $query = $this->select('node_field_data', 'n');

    $query->fields('n', [
      'nid',
      'type',
      'title',
      'status',
    ]);

    $query->addField('n', 'langcode', 'legacy_langcode');

    $query->innerJoin(
      'node__body',
      'b',
      '[b].[entity_id] = [n].[nid]
        AND [b].[deleted] = 0
        AND [b].[delta] = 0
        AND [b].[langcode] = [n].[langcode]'
    );

    $query->addField('b', 'body_value', 'body_value');
    $query->addField('b', 'body_format', 'body_format');

    $query->leftJoin(
      'node__field_weight',
      'w',
      '[w].[entity_id] = [n].[nid]
        AND [w].[deleted] = 0
        AND [w].[delta] = 0
        AND [w].[langcode] = [n].[langcode]'
    );

    $query->addField('w', 'field_weight_value', 'field_weight');

    $query->condition('n.type', [
      'angular',
      'css',
      'drupal',
      'html',
      'javascript',
      'php',
      'varie',
    ], 'IN');

    $query->condition('n.default_langcode', 1);

    return $query;
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'nid' => $this->t('Legacy node ID'),
      'type' => $this->t('Content type machine name'),
      'title' => $this->t('Node title'),
      'status' => $this->t('Publication status'),
      'legacy_langcode' => $this->t('Legacy language code'),
      'body_value' => $this->t('Body HTML'),
      'body_format' => $this->t('Body text format'),
      'field_weight' => $this->t('Article weight within its area'),
      'approfondimenti' => $this->t('External links associated with the article'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'nid' => [
        'type' => 'integer',
        'alias' => 'n',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    $nid = $row->getSourceProperty('nid');
    $langcode = $row->getSourceProperty('legacy_langcode');

    $query = $this->select('node__field_approfondimenti', 'a')
      ->fields('a', [
        'field_approfondimenti_uri',
        'field_approfondimenti_title',
      ])
      ->condition('a.entity_id', $nid)
      ->condition('a.deleted', 0)
      ->condition('a.langcode', $langcode)
      ->orderBy('a.delta');

    $links = [];

    foreach ($query->execute() as $link) {
      $links[] = [
        'uri' => $link['field_approfondimenti_uri'],
        'title' => $link['field_approfondimenti_title'],
      ];
    }

    $row->setSourceProperty('approfondimenti', $links);

    return parent::prepareRow($row);
  }

}
