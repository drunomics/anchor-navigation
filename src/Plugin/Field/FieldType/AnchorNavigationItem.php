<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Provides a field type of anchor navigation.
 *
 * @FieldType(
 *   id = "anchor_navigation",
 *   label = @Translation("Anchor navigation"),
 *   default_formatter = "anchor_navigation_formatter",
 *   default_widget = "anchor_navigation_widget",
 * )
 */
class AnchorNavigationItem extends FieldItemBase implements FieldItemInterface {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return [
      'columns' => [
        'enabled' => [
          'type' => 'int',
          'size' => 'tiny',
          'unsigned' => 'true',
        ],
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = [];
    $properties['enabled'] = DataDefinition::create('boolean')
      ->setLabel(t('Enables the anchor navigation.'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    return !$this->isEnabled();
  }

  /**
   * Checks whether this anchor navigation is enabled.
   *
   * @return bool
   */
  public function isEnabled() {
    $enabled = $this->get('enabled')->getValue();
    return !empty($enabled);
  }

}
