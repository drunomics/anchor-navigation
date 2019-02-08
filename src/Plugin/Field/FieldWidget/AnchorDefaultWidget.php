<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldWidget;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\WidgetInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Widget for the anchor field.
 *
 * @FieldWidget(
 *   id = "anchor_navigation_anchor_widget",
 *   label = @Translation("Anchor widget"),
 *   field_types = {
 *     "anchor_navigation_anchor"
 *   }
 * )
 */
class AnchorDefaultWidget extends WidgetBase implements WidgetInterface {

  /**
   * {@inheritdoc}
   */
  public function form(FieldItemListInterface $items, array &$form, FormStateInterface $form_state, $get_delta = NULL) {
    $build_info = $form_state->getBuildInfo();

    // Show form by default (e.g.: on the field config form).
    $show_form = TRUE;
    // If the element is on a node form, only show it if it also has the anchor
    // navigation field attached to it.
    if (!empty($build_info['base_form_id']) && $build_info['base_form_id'] == 'node_form') {
      /** @var \Drupal\node\NodeForm $node_form */
      $node_form = $build_info['callback_object'];
      /** @var \Drupal\node\NodeInterface $node */
      $node = $node_form->getEntity();
      $show_form = anchor_navigation_has_anchor_navigation($node);
    }

    if (!$show_form) {
      return [];
    }

    return parent::form($items, $form, $form_state, $get_delta);
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = [];

    $label = isset($items[$delta]->label) ? $items[$delta]->label : '';
    $enabled = (bool) isset($items[$delta]->enabled) ? $items[$delta]->enabled : FALSE;

    // Unique class of the enabled checkbox for visibility magic.
    $enabled_class = $this->fieldDefinition->getName() . '_enabled_' . substr(md5($items->getEntity()->id() . time()), 0, 8);

    $element['enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Include in the anchor navigation'),
      '#default_value' => $enabled,
      '#attributes' => [
        'class' => [$enabled_class],
      ],
    ];

    $element['label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Anchor label'),
      '#default_value' => $label,
      '#states' => [
        'visible' => [
          '.' . $enabled_class => ['checked' => TRUE],
        ],
      ],
      '#element_validate' => [[$this, 'validateLabel']],
    ];

    if ($label_fallback = $this->fieldDefinition->getSetting('label_fallback')) {
      $params = [
        '%fallback' => $items->getEntity()->getFieldDefinition($label_fallback)->getLabel(),
      ];
      $element['label']['#description'] = $this->t('If empty, will use the value from the field %fallback.', $params);
    }

    return $element;
  }

  /**
   * Validates the label element.
   *
   * @param array $element
   *   The element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state.
   * @param array $form
   *   The form.
   */
  public function validateLabel(array &$element, FormStateInterface $form_state, array &$form) {
    $parents = $element['#parents'];
    array_pop($parents);
    $anchor_element = NestedArray::getValue($form_state->getValues(), $parents);

    // Check if its even enabled, if the label is filled out we are ok too.
    if (empty($anchor_element['enabled']) || !empty($anchor_element['label'])) {
      return;
    }

    // Its enabled but the label is empty, check if the fallback is filled out.
    if ($label_fallback = $this->fieldDefinition->getSetting('label_fallback')) {
      $fallback_parents = [];
      foreach ($parents as $parent) {
        if ($parent === $this->fieldDefinition->getName()) {
          break;
        }
        $fallback_parents[] = $parent;
      }
      $fallback_element = NestedArray::getValue($form_state->getValues(), $fallback_parents);

      // The fallback is filled out.
      if (!empty($fallback_element[$label_fallback][0]['value'])) {
        return;
      }

      $error_msg = $this->t('The anchor label and the label fallback cannot be empty at the same time.');
    }
    else {
      $error_msg = $this->t('The anchor label cannot be empty.');
    }

    $form_state->setError($element, $error_msg);
  }

}
