<?php

declare(strict_types=1);

namespace Drupal\appunti_digitali_migrate\Plugin\migrate\source;

use Drupal\migrate\Attribute\MigrateSource;
use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 * Provides article images from the legacy Drupal 8 database.
 *
 * Exposes managed inline images used by published technical articles and
 * prepares their physical source path and Drupal 11 destination URI.
 */
#[MigrateSource('appunti_digitali_legacy_article_image')]
final class LegacyArticleImage extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $query = $this->select('file_managed', 'fm');

    $query->fields('fm', [
      'fid',
      'uuid',
      'filename',
      'uri',
      'filemime',
      'filesize',
      'status',
    ]);

    $query->innerJoin(
      'file_usage',
      'fu',
      '[fu].[fid] = [fm].[fid]'
    );

    $query->innerJoin(
      'node_field_data',
      'n',
      '[n].[nid] = [fu].[id]'
    );

    $query->condition(
      'fm.uri',
      'private://inline-images/%',
      'LIKE'
    );

    $query->condition('fu.module', 'editor');
    $query->condition('fu.type', 'node');
    $query->condition('n.status', 1);
    $query->condition('n.default_langcode', 1);

    $query->condition('n.type', [
      'angular',
      'css',
      'drupal',
      'html',
      'javascript',
      'php',
      'varie',
    ], 'IN');

    $query->distinct();

    return $query;
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'fid' => $this->t('Legacy file ID'),
      'uuid' => $this->t('Legacy file UUID'),
      'filename' => $this->t('File name'),
      'uri' => $this->t('Legacy file URI'),
      'filemime' => $this->t('MIME type'),
      'filesize' => $this->t('File size'),
      'status' => $this->t('File status'),
      'source_path' => $this->t('Physical source file path'),
      'destination_uri' => $this->t('Drupal 11 destination URI'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'fid' => [
        'type' => 'integer',
        'alias' => 'fm',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    $filename = (string) $row->getSourceProperty('filename');

    $row->setSourceProperty(
      'source_path',
      dirname(DRUPAL_ROOT)
      . '/legacy-files/inline-images/'
      . $filename
    );

    $row->setSourceProperty(
      'destination_uri',
      'public://article-images/' . $filename
    );

    return parent::prepareRow($row);
  }

}
