import stickyEl from './lib/stickyEl';
const componentName = 'anchor-navigation';
const baseSelector = '.' + componentName;
const triggerSelector = baseSelector + '__trigger';
const navEls = [];

initAnchorNavigation();

window.addEventListener('initAnchorNavigation', initAnchorNavigation);

function initAnchorNavigation() {
  debugger;
  window.AnchorNavigation = [];
  navEls.push(...Array.from(document.querySelectorAll('section' + baseSelector));
  for (let index in navEls) {
    let navEl = navEls[index];

    // Skip if already initialized.
    if (typeof window.AnchorNavigation[index] !== 'undefined') {
      continue;
    }
    window.AnchorNavigation[index] = {};
    window.AnchorNavigation[index].settings = null;
    window.AnchorNavigation[index].init = once(() => {
      buildNavigation(navEl, index);
    });

    if (navEl && !navEl.dataset.attached) {
      window.AnchorNavigation[index].settings = drupalSettings.anchorNavigation;
      window.AnchorNavigation[index].init();
      navEl.dataset.attached = true;
    }
  }
}

/**
 * Initiates the anchor navigation.
 */
function buildNavigation (navEl, index) {
  const parentEl = navEl.parentElement;
  const tocLinks = navEl.querySelectorAll('a.toc_link');
  const scrollTopTrigger = navEl.querySelector(baseSelector + '__scroll-top ' + triggerSelector);
  const tocTrigger = navEl.querySelector(baseSelector + '__toc ' + triggerSelector);
  const socialTrigger = navEl.querySelector(baseSelector + '__social-icons ' + triggerSelector);
  const defaultVariant = window.AnchorNavigation[index].settings.breakpoints[0].display;
  const defaultSetting = window.AnchorNavigation[index].settings.displaySettings[defaultVariant];

  window.AnchorNavigation[index].overlayElement = document.createElement('div');

  window.AnchorNavigation[index].stickyInstance = new stickyEl(
    navEl,
    defaultVariant === 'sticky'
    ? defaultSetting.offset
    : window.innerHeight - defaultSetting.offset,
    defaultSetting.limitToParent
  );

  window.addEventListener('resize', (event) => {
    displayVariant(window.innerWidth, index);
  });

  displayVariant(window.innerWidth, index);

  parentEl.classList.add('anchor-navigation-tether');
  navEl.style.color = window.AnchorNavigation[index].settings.highlightColor;

  window.AnchorNavigation[index].overlayElement.classList.add('anchor-navigation-overlay');
  window.AnchorNavigation[index].overlayElement.addEventListener('click', () => {
    closeChildMenu(tocTrigger);
    closeChildMenu(socialTrigger);
  });

  Array.from(tocLinks).forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const destinationElId = event.target.href.split('#')[1];
      const target = document.querySelector('#' + destinationElId);

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset,
          behavior: 'smooth',
        });
      }
      else {
        window.scrollTo(0, target.getBoundingClientRect().top + window.pageYOffset);
      }

      closeChildMenu(tocTrigger);
    });
  });

  if (tocTrigger) {
    tocTrigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (menuIsOpen(tocTrigger)) {
        closeChildMenu(tocTrigger);
      }
      else {
        closeChildMenu(socialTrigger);
        openChildMenu(tocTrigger, index);
      }
    });
  }

  if (socialTrigger) {
    socialTrigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (menuIsOpen(socialTrigger)) {
        closeChildMenu(socialTrigger);
      }
      else {
        closeChildMenu(tocTrigger);
        openChildMenu(socialTrigger, index);
      }
    });
  }

  if (scrollTopTrigger) {
    scrollTopTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const wrapper = parents(navEls[index], baseSelector + '__wrapper') || parentEl;
      const parentBoundings = wrapper.getBoundingClientRect();
      const destination = (parentBoundings.y + window.pageYOffset) - (window.innerHeight / 7);

      closeChildMenu(socialTrigger);
      closeChildMenu(tocTrigger);

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: destination,
          behavior: 'smooth',
        });
      }
      else {
        window.scrollTo(0, destination);
      }
    })
  }
}

/**
 * Find and return the current status of the menu for which the elements parent is passed.
 *
 * @param {HTMLElement} parent
 *
 * @returns {boolean}
 *    True or false wether the menu is currently open.
 */
function menuIsOpen(el) {
  const menu = el.parentElement.querySelector(baseSelector + '__menu');
  const openClass = componentName + '__menu--open';

  return menu.classList.contains(openClass);
}

/**
 * Find and close the menu within the passed elements parent.
 *
 * @param {HTMLElement} parent
 */
function closeChildMenu(el) {
  if (!el) {
    return;
  }
  const overlay = document.querySelector('.anchor-navigation-overlay');
  const menu = el.parentElement.querySelector(baseSelector + '__menu');
  const openClass = componentName + '__menu--open';

  document.body.classList.remove(openClass);
  menu.classList.remove(openClass);
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

/**
 * Find and open the menu within the passed elements parent.
 *
 * @param {HTMLElement} parent
 */
function openChildMenu(el, index) {
  const menu = el.parentElement.querySelector(baseSelector + '__menu');
  const openClass = componentName + '__menu--open';

  document.body.classList.add(openClass);
  menu.classList.add(openClass);
  document.body.appendChild(window.AnchorNavigation[index].overlayElement);
}

/**
 * Determine and set which variant to use for the navigation.
 *
 * @param {integer} currentSize
 *    The current size of the window.
 */
function displayVariant(currentSize, index) {
  let variant = 'sticky';

  for (let i = 0; i < window.AnchorNavigation[index].settings.breakpoints.length; i++) {
    const breakpoint = window.AnchorNavigation[index].settings.breakpoints[i];
    const nextBreakpoint = window.AnchorNavigation[index].settings.breakpoints[i+1] || null;
    if (
      !nextBreakpoint
      || currentSize < nextBreakpoint.breakpointUp
    ) {
      variant = breakpoint.display;
      break;
    }
  }

   const setting = window.AnchorNavigation[index].settings.displaySettings[variant];
   const navEl = navEls[index];
   navEl.className = [
     componentName,
     componentName + '--' + variant
   ].join(' ');
   if (window.AnchorNavigation[index].stickyInstance) {
     window.AnchorNavigation[index].stickyInstance.update(
       navEl,
       variant === 'sticky'
       ? setting.offset
       : window.innerHeight - setting.offset,
       setting.limitToParent
     );
   }
}

/**
 * Helper function to run a given function only once.
 *
 * @param {Function} fn
 *    The function to run.
 *
 * @param {*} context
 *    The context to apply to the function, defaults to _this_.
 */
function once(fn, context) {
  var result;
  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }
    return result;
  };
}

/**
 * Returns matching parent element or false if not matching element was found.
 *
 * @param {HTMLElement} el
 * @param {String} parentSelector
 * @returns {boolean|HTMLElement}
 */
function parents(el, parentSelector) {
  const parent = el.parentNode;

  if (parent === null) {
    return false;
  }

  return parent.matches(parentSelector) ? parent : parents(parent, parentSelector);
}

export {initAnchorNavigation}
