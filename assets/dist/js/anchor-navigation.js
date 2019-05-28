!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){n(1),t.exports=n(3)},function(t,e,n){"use strict";var i,o,r,a=(i=n(2))&&i.__esModule?i:{default:i},s="anchor-navigation",c="."+s,l=c+"__trigger",u=document.querySelector("section"+c+":not("+c+"--block)");function d(t){var e=t.parentElement.querySelector(c+"__menu"),n=s+"__menu--open";return e.classList.contains(n)}function f(t){if(t){var e=document.querySelector(".anchor-navigation-overlay"),n=t.parentElement.querySelector(c+"__menu"),i=s+"__menu--open";document.body.classList.remove(i),n.classList.remove(i),e&&document.body.removeChild(e)}}function h(t){var e=t.parentElement.querySelector(c+"__menu"),n=s+"__menu--open";document.body.classList.add(n),e.classList.add(n),document.body.appendChild(window.AnchorNavigation.overlayElement)}function v(t){for(var e="sticky",n=0;n<window.AnchorNavigation.settings.breakpoints.length;n++){var i=window.AnchorNavigation.settings.breakpoints[n],o=window.AnchorNavigation.settings.breakpoints[n+1]||null;if(!o||t<o.breakpointUp){e=i.display;break}}var r=window.AnchorNavigation.settings.displaySettings[e];u.className=[s,s+"--"+e].join(" "),window.AnchorNavigation.stickyInstance&&window.AnchorNavigation.stickyInstance.update(u,"sticky"===e?r.offset:window.innerHeight-r.offset,r.limitToParent)}u.classList.contains(s+"--in-content")||(window.AnchorNavigation={},window.AnchorNavigation.settings=null,window.AnchorNavigation.init=(o=function(){var t,e,n,i,o,r,s;t=u.parentElement,e=u.querySelectorAll("a.toc_link"),n=u.querySelector(c+"__scroll-top "+l),i=u.querySelector(c+"__toc "+l),o=u.querySelector(c+"__social-icons "+l),r=window.AnchorNavigation.settings.breakpoints[0].display,s=window.AnchorNavigation.settings.displaySettings[r],window.AnchorNavigation.overlayElement=document.createElement("div"),window.AnchorNavigation.stickyInstance=new a.default(u,"sticky"===r?s.offset:window.innerHeight-s.offset,s.limitToParent),window.addEventListener("resize",function(t){v(window.innerWidth)}),v(window.innerWidth),t.classList.add("anchor-navigation-tether"),u.style.color=window.AnchorNavigation.settings.highlightColor,window.AnchorNavigation.overlayElement.classList.add("anchor-navigation-overlay"),window.AnchorNavigation.overlayElement.addEventListener("click",function(){f(i),f(o)}),Array.from(e).forEach(function(t){t.addEventListener("click",function(t){t.preventDefault();var e=t.target.href.split("#")[1],n=document.querySelector("#"+e);"scrollBehavior"in document.documentElement.style?window.scrollTo({top:n.getBoundingClientRect().top+window.pageYOffset,behavior:"smooth"}):window.scrollTo(0,n.getBoundingClientRect().top+window.pageYOffset),f(i)})}),i&&i.addEventListener("click",function(t){t.preventDefault(),d(i)?f(i):(f(o),h(i))}),o&&o.addEventListener("click",function(t){t.preventDefault(),d(o)?f(o):(f(i),h(o))}),n&&n.addEventListener("click",function(e){e.preventDefault();var n=t.getBoundingClientRect().y+window.pageYOffset-window.innerHeight/7;f(o),f(i),"scrollBehavior"in document.documentElement.style?window.scrollTo({top:n,behavior:"smooth"}):window.scrollTo(0,n)})},function(){return o&&(r=o.apply(this,arguments),o=null),r}),u&&!u.dataset.attached&&(window.AnchorNavigation.settings=drupalSettings.anchorNavigation,window.AnchorNavigation.init(),u.dataset.attached=!0))},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=function(){function t(e,n,i,o){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.el=o?e.querySelector(o):e,this.margin=n||0,this.limitToParent=i||!1,this.offset=0,this.originalTransform=getComputedStyle(this.el).transform,this.stick(),this.updatePosition()}return i(t,[{key:"update",value:function(t,e,n,i){this.resetTransform(),this.el=i?t.querySelector(i):t,this.margin=e||0,this.limitToParent=n||!1,this.offset=0,this.originalTransform=getComputedStyle(this.el).transform,this.updatePosition()}},{key:"stick",value:function(){var t=this;window.onload=function(){document.addEventListener("scroll",function(){t.updatePosition()}),t.updatePosition()}}},{key:"updatePosition",value:function(){var t=this.el.getBoundingClientRect(),e=this.el.parentElement.getBoundingClientRect(),n=e.left<=t.left&&e.top<=t.top,i=e.height-t.height;n&&(i=e.height);var o=this.offset-t.top+this.margin;this.limitToParent&&o>i&&(o=i),this.setPosition(o)}},{key:"setPosition",value:function(t){var e=this.originalTransform.split(",");this.offset=t>0?t:0,e[5]=this.offset+")",this.el.style.transform=e.join(",")}},{key:"resetTransform",value:function(){this.el.style.transform=""}}]),t}();e.default=o},function(t,e,n){}]);