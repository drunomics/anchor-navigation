const componentName = 'anchor-navigation';
const baseSelector = '.' + componentName;
const triggerSelector = baseSelector + '__trigger';
// const navEl = document.querySelector('section' + baseSelector);
const navEl = document.querySelector('section' + baseSelector + ':not(' + baseSelector + '--block)');
if (!navEl.classList.contains(componentName + '--in-content')) {
  window.AnchorNavigation = {};
  window.AnchorNavigation.settings = null;
  window.AnchorNavigation.init = once(() => {
    buildNavigation();
  });

  if (navEl && !navEl.dataset.attached) {
    window.AnchorNavigation.settings = drupalSettings.anchorNavigation;
    window.AnchorNavigation.init();
    navEl.dataset.attached = true;
  }
}

/**
 * Initiates the anchor navigation.
 */
function buildNavigation () {
  const parentEl = navEl.parentElement;
  const tocLinks = navEl.querySelectorAll('a.toc_link');
  const scrollTopTrigger = navEl.querySelector(baseSelector + '__scroll-top ' + triggerSelector);
  const tocTrigger = navEl.querySelector(baseSelector + '__toc ' + triggerSelector);
  const socialTrigger = navEl.querySelector(baseSelector + '__social-icons ' + triggerSelector);
  const defaultVariant = window.AnchorNavigation.settings.breakpoints[0].display;
  const defaultSetting = window.AnchorNavigation.settings.displaySettings[defaultVariant];
  const inlineAnchorNavEl = document.querySelector('.anchor-navigation--block')

  window.AnchorNavigation.overlayElement = document.createElement('div');

  // Build a wrapper element around the navigation
  const wrapperElement = document.createElement('div');
  wrapperElement.classList.add(componentName + '__wrapper')
  // Insert the wrapper in the parent element
  parentEl.appendChild(wrapperElement);
  // Move the navigation to the wrapper
  wrapperElement.appendChild(navEl);

  window.addEventListener('resize', (event) => {
    displayVariant(window.innerWidth);
  });

  displayVariant(window.innerWidth);

  parentEl.classList.add('anchor-navigation-tether');
  navEl.style.color = window.AnchorNavigation.settings.highlightColor;

  window.AnchorNavigation.overlayElement.classList.add('anchor-navigation-overlay');
  window.AnchorNavigation.overlayElement.addEventListener('click', () => {
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
        openChildMenu(tocTrigger);
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
        openChildMenu(socialTrigger);
      }
    });
  }

  if (scrollTopTrigger) {
    scrollTopTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const parentBoundings = parentEl.getBoundingClientRect();
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

  if (tocTrigger && inlineAnchorNavEl && window.IntersectionObserver) {
    const observer = new IntersectionObserver (
      (els) => {
        if (els[0].intersectionRatio > 0) {
          tocTrigger.dataset.originalWidth = tocTrigger.dataset.originalWidth || tocTrigger.offsetWidth
          tocTrigger.style.maxWidth = 0
          tocTrigger.classList.add('collapsed')
        } else {
          tocTrigger.style.maxWidth = `${tocTrigger.dataset.originalWidth}px`;
          tocTrigger.classList.remove('collapsed')
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    )
    observer.observe(inlineAnchorNavEl)
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
function openChildMenu(el) {
  const menu = el.parentElement.querySelector(baseSelector + '__menu');
  const openClass = componentName + '__menu--open';

  document.body.classList.add(openClass);
  menu.classList.add(openClass);
  document.body.appendChild(window.AnchorNavigation.overlayElement);
}

/**
 * Determine and set which variant to use for the navigation.
 *
 * @param {integer} currentSize
 *    The current size of the window.
 */
function displayVariant(currentSize) {
  let variant = 'sticky';

  for (let i = 0; i < window.AnchorNavigation.settings.breakpoints.length; i++) {
    const breakpoint = window.AnchorNavigation.settings.breakpoints[i];
    const nextBreakpoint = window.AnchorNavigation.settings.breakpoints[i+1] || null;
    if (
      !nextBreakpoint
      || currentSize < nextBreakpoint.breakpointUp
    ) {
      variant = breakpoint.display;
      break;
    }
  }

   const setting = window.AnchorNavigation.settings.displaySettings[variant];
   navEl.className = [
     componentName,
     componentName + '--' + variant
   ].join(' ');
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
