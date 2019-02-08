<?php

namespace Drupal\anchor_navigation\Plugin\Field\FieldFormatter;

use Drupal\anchor_navigation\Plugin\Field\FieldType\AnchorItem;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Formatter for the Anchor field.
 *
 * @FieldFormatter(
 *   id = "anchor_navigation_anchor_formatter",
 *   label = @Translation("Anchor formatter"),
 *   field_types = {
 *     "anchor_navigation_anchor"
 *   }
 * )
 */
class AnchorDefaultFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $anchor = !empty($items[0]) ? $items[0] : NULL;
    if (!$anchor instanceof AnchorItem || $anchor->isEmpty()) {
      return [];
    }

    $build = [
      '#type' => 'markup',
      '#markup' => sprintf('<div class="anchor-navigation__anchor" id="%s"></div>', $anchor->getAnchorId()),
      // Make sure the anchor comes before the content.
      '#weight' => -1000,
    ];

    return $build;
  }

}
