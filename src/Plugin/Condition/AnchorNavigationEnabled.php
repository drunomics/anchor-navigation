<?php

namespace Drupal\anchor_navigation\Plugin\Condition;

use Drupal\Core\Condition\ConditionPluginBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\NodeInterface;

/**
 * Condition to check if the anchor navigation is enabled for the current node.
 *
 * @Condition(
 *   id = "anchor_navigation_enabled",
 *   label = @Translation("Anchor navigation"),
 *   context = {
 *     "node" = @ContextDefinition("entity:node",
 *       label = @Translation("Node"),
 *       description = @Translation("The current page's main node if any."),
 *       required = false,
 *     )
 *   }
 * )
 */
class AnchorNavigationEnabled extends ConditionPluginBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return ['enabled' => FALSE] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    // The core block config form is too stupid to configure our condition if
    // there is nothing to configure. Thus, we add a non-sense "enabled" flag.
    $form['enabled'] = [
      '#title' => $this->t('Enable this condition'),
      '#description' => $this->t('If enabled, the block will only be rendered if the node has an active anchor navigation.'),
      '#type' => 'checkbox',
      '#default_value' => $this->configuration['enabled'],
    ];
    return parent::buildConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['enabled'] = $form_state->getValue('enabled');
    parent::submitConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function evaluate() {
    // If the condition is exported but disabled.
    if (!$this->configuration['enabled']) {
      return TRUE;
    }

    /** @var \Drupal\node\NodeInterface $node */
    $node = $this->getContextValue('node');
    if (!$node instanceof NodeInterface) {
      return FALSE;
    }

    $anchor_navigation = anchor_navigation_get_anchor_navigation($node);
    return $anchor_navigation && $anchor_navigation->isEnabled();
  }

  /**
   * {@inheritdoc}
   */
  public function summary() {
    return $this->t('Anchor navigation');
  }

}
