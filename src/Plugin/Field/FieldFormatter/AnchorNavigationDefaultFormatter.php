<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Formatter for the Anchor navigation field.
 *
 * @FieldFormatter(
 *   id = "anchor_navigation_formatter",
 *   label = @Translation("Anchor navigation"),
 *   field_types = {
 *     "anchor_navigation"
 *   }
 * )
 */
class AnchorNavigationDefaultFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'render_mode' => 'field',
      'render_inline' => FALSE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    $settings = $this->getSettings();

    switch ($settings['render_mode']) {
      case 'block':
        $summary[] = $this->t('Rendered via Anchor navigation block.');
        break;

      case 'field':
      default:
        $summary[] = $this->t('Rendered as a field.');
    }

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $element['render_mode'] = [
      '#title' => $this->t('Render mode'),
      '#type' => 'select',
      '#options' => [
        'field' => $this->t('Field'),
        'block' => $this->t('Block'),
      ],
      '#default_value' => $this->getSetting('render_mode'),
    ];

    $element['render_inline'] = [
      '#title' => $this->t('Render inline (static) in addition to sticky.'),
      '#type' => 'checkbox',
      '#default_value' => $this->getSetting('render_inline'),
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $render_mode = $this->getSetting('render_mode');
    $render_inline = $this->getSetting('render_inline');

    $build = [];
    $build[] = anchor_navigation_toc_build($items->getEntity(), $render_mode);
    if ($render_inline && $render_mode != 'block') {
      $build[] = anchor_navigation_toc_build($items->getEntity(), 'block');
    }

    return $build;
  }

}
