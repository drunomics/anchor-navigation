/**
 * Class for creating "stickyElements" that follow the window on scroll.
 */
class StickyEl {

  /**
   * @param {HTMLElement} element
   *    The target element to make into a stickyElement.
   *
   * @param {Integer} margin
   *    Spacing from the window expressed number of pixels.
   *
   * @param {Boolean} limitToParent
   *    Wether or not the stickyElement should stop following the window scroll past the parent element.
   *
   * @param {String} childSelector
   *    Additional selector to search for with the passed element,
   *    will be used as the target element.
   */
  constructor(element, margin, limitToParent, childSelector) {
    this.el = childSelector ? element.querySelector(childSelector) : element;
    this.margin = margin || 0;
    this.limitToParent = limitToParent || false;
    this.offset = 0;

    this.originalTransform = getComputedStyle(this.el).transform;
    this.stick();
    this.updatePosition();
  }

  /**
   * Update the element with a new set of properties.
   *
   * @param {HTMLElement} element
   *    The target element to make into a stickyElement.
   *
   * @param {Integer} margin
   *    Spacing from the window expressed number of pixels.
   *
   * @param {Boolean} limitToParent
   *    Wether or not the stickyElement should stop following the
   *    window scroll past the parent element.
   *
   * @param {String} childSelector
   *    Additional selector to search for with the passed element,
   *    will be used as the target element.
   */
  update(element, margin, limitToParent, childSelector) {
    this.resetTransform();

    this.el = childSelector ? element.querySelector(childSelector) : element;
    this.margin = margin || 0;
    this.limitToParent = limitToParent || false;
    this.offset = 0;
    this.originalTransform = getComputedStyle(this.el).transform;
    this.updatePosition();
  }

  /**
   * Call the updatePosition method and adds an event listener to the window
   * to call updatePosition on scroll.
   */
  stick() {
    const self = this;
    window.onload = () => {
      document.addEventListener('scroll', () => {
        self.updatePosition();
      });
      self.updatePosition();
    };
  }

  /**
   * Calculates the new position and wether or not to update it on the element.
   */
  updatePosition() {
    const elRect = this.el.getBoundingClientRect();
    const parentRect = this.el.parentElement.getBoundingClientRect();
    const insideParentElement = parentRect.left <= elRect.left && parentRect.top <= elRect.top;

    let heightDiff = parentRect.height - elRect.height;
    if (insideParentElement) {
      heightDiff = parentRect.height;
    }

    let newOffset = (this.offset - elRect.top) + this.margin;
    if (this.limitToParent && newOffset > heightDiff) {
      newOffset = heightDiff;
    }

    this.setPosition(newOffset);
  }

  /**
   * Sets the passed offset position as a transform to the element.
   *
   * @param {Float} position
   *    The new position expressed in pixels.
   */
  setPosition(position) {
    const transformMatrix = this.originalTransform.split(',');

    this.offset = position > 0 ? position : 0;

    /**
     * Assign the offset to the sixth property of the transform matrix,
     * the sixth prop being the Y offset of the translation.
     *
     * The transform matrix is used to maintain any additional transforms,
     * inherited by the computed style of the element and not override them,
     * changing only the Y position.
     *
     * More info at:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
     */
    transformMatrix[5] = this.offset + ')';
    this.el.style.transform = transformMatrix.join(',');
  }

  /**
   * Resets the transform property on the element.
   */
  resetTransform() {
    this.el.style.transform = '';
  }
}

export default StickyEl;
