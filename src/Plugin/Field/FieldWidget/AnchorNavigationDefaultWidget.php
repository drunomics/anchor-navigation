<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\WidgetInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Widget for the anchor navigation field.
 *
 * @FieldWidget(
 *   id = "anchor_navigation_widget",
 *   label = @Translation("Anchor navigation widget"),
 *   field_types = {
 *     "anchor_navigation"
 *   }
 * )
 */
class AnchorNavigationDefaultWidget extends WidgetBase implements WidgetInterface {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $enabled = !$items[$delta]->isEmpty();
    $element = [];

    $element['enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable anchor navigation'),
      '#description' => $this->t('Create the anchor navigation from all paragraphs who have the anchor field enabled.'),
      '#default_value' => $enabled,
    ];

    return $element;
  }

}
