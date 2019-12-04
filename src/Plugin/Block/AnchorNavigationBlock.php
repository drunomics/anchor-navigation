<?php

namespace Drupal\anchor_navigation\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\node\Entity\Node;

/**
 * AnchorNavigationBlock places the anchor navigation field as a block.
 *
 * @Block(
 *   id = "anchor_navigation_block",
 *   admin_label = @Translation("Anchor Navigation"),
 *   category = @Translation("Menus"),
 *   context = {
 *     "node" = @ContextDefinition("entity:node")
 *   }
 * )
 */
class AnchorNavigationBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $node = $this->getNode();
    if (!$node) {
      return [];
    }

    $build = anchor_navigation_toc_build($node, 'block');
    return $build;
  }

  /**
   * Gets the current node.
   *
   * @return \Drupal\Node\NodeInterface|null
   */
  protected function getNode() {
    if (isset($this->getConfiguration()['node']) && $this->getConfiguration()['node'] instanceof Node) {
      return $this->getConfiguration()['node'];
    }
    return $this->getContextValue('node');
  }

}
