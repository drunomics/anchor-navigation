<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldType;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\TypedData\DataDefinition;
use Drupal\field\Entity\FieldConfig;
use Drupal\paragraphs\ParagraphInterface;

/**
 * Provides a field type of anchor.
 *
 * @FieldType(
 *   id = "anchor_navigation_anchor",
 *   label = @Translation("Anchor"),
 *   default_formatter = "anchor_navigation_anchor_formatter",
 *   default_widget = "anchor_navigation_anchor_widget",
 * )
 */
class AnchorItem extends FieldItemBase implements FieldItemInterface {

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
        'label' => [
          'type' => 'text',
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
      ->setLabel(t('Enables the anchor link.'));
    $properties['label'] = DataDefinition::create('string')
      ->setLabel(t('Anchor label.'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function mainPropertyName() {
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultFieldSettings() {
    return [
      'label_fallback' => '',
    ] + parent::defaultFieldSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function fieldSettingsForm(array $form, FormStateInterface $form_state) {
    $element = [];

    $element['label_fallback'] = [
      '#type' => 'select',
      '#default_value' => $this->getSetting('label_fallback'),
      '#title' => $this->t('Anchor label fallback'),
      '#description' => $this->t('Use the value of this field as a fallback for the label if the anchor label is empty.'),
      '#options' => $this->getLabelFallbackOptions(),
      '#element_validate' => [[$this, 'validateLabelFallback']],
      '#empty_value' => '',
    ];

    return $element;
  }

  /**
   * Gets all valid options for the label fallback field.
   *
   * @return array
   */
  protected function getLabelFallbackOptions() {
    /** @var \Drupal\Core\Entity\EntityFieldManagerInterface $field_manager */
    $field_manager = \Drupal::service('entity_field.manager');
    $field_definitions = $field_manager->getFieldDefinitions($this->getEntity()->getEntityTypeid(), $this->getEntity()->bundle());

    $options = [];
    foreach ($field_definitions as $field_name => $field_definition) {
      if (
        $field_definition instanceof FieldConfig
        && $field_definition->getType() != $this->getFieldDefinition()->getType()
        && in_array($field_definition->getType(), ['text', 'string'])
      ) {
        $options[$field_name] = $field_definition->label() . " ($field_name)";
      }
    }

    return $options;
  }

  /**
   * Validates the label fallback element.
   *
   * @param array $element
   *   The element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state.
   * @param array $form
   *   The form.
   */
  public function validateLabelFallback(array &$element, FormStateInterface $form_state, array &$form) {
    $settings = $form_state->getValue('settings');
    $label_fallback = $settings['label_fallback'];
    $valid_options = $this->getLabelFallbackOptions();
    if (!empty($label_fallback) && !isset($valid_options[$label_fallback])) {
      $params = ['%allowed', implode(",", array_keys($valid_options))];
      $form_state->setError($element, $this->t('Invalid label fallback, allowed are: %allowed', $params));
    }
  }

  /**
   * Gets the anchor label with fallback.
   *
   * @return string
   */
  public function getAnchorLabel() {
    $label = $this->get('label')->getValue();

    if (empty($label) && $label_fallback = $this->getFieldDefinition()->getSetting('label_fallback')) {
      $value = $this->getEntity()->get($label_fallback)->getValue();
      $label = !empty($value[0]['value']) ? $value[0]['value'] : '';
    }

    return $label;
  }

  /**
   * Gets the html id for the anchor.
   *
   * @return string
   */
  public function getAnchorId() {
    // Starts with a static `a` for Anchor to get a valid HTML id.
    $ids = [
      'a',
      $this->getEntity()->id(),
      $this->getAnchorLabel(),
    ];

    return Html::getId(implode('-', $ids));
  }

  /**
   * Checks whether this anchor is enabled.
   *
   * @return bool
   */
  public function isEnabled() {
    $enabled = $this->get('enabled')->getValue();
    return !empty($enabled);
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $entity = $this->getEntity();
    $label = $this->get('label')->getValue();
    $enabled = $this->get('enabled')->getValue();

    if (empty($label) && empty($enabled)) {
      return TRUE;
    }

    if ($entity instanceof ParagraphInterface && $entity->getParentEntity()) {
      $node = $entity->getParentEntity();
      if (!anchor_navigation_has_anchor_navigation($node)) {
        return TRUE;
      }
    }

    return parent::isEmpty();
  }

}
