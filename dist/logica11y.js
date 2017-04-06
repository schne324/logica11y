"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.logica11y = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      'use strict';

      /**
       * attributes(el, [{
       *   name: 'aria-live',
       *   value: ['polite', 'assertive']
       * }, {
       *   name: 'role',
       *   value: 'tab'
       * }, {
       *   name: 'aria-controls'
       * }])
       */

      module.exports = function (el, attrs) {
        var result = { valid: true, failures: [], passes: [] };

        attrs.forEach(function (attr) {
          var actual = el.getAttribute(attr.name);
          if (!!actual && !attr.value) {
            return;
          } // valid. element has the attribute (no value was required).

          var expected = Array.isArray(attr.value) ? attr.value : [attr.value];
          var isFail = !actual || expected.indexOf(actual) > -1;
          var key = isFail ? 'failures' : 'passes';
          result[key].push({
            message: (isFail ? 'Expected' : 'Confirmed') + " " + attr.name + " attribute to have a value of " + expected.join(' or ')
          });

          if (isFail) {
            result.valid = false;
          }
        });

        return result;
      };
    }, {}], 2: [function (require, module, exports) {
      'use strict';

      // TODO: fire a keypress, keydown, then a keypress?

      module.exports = function (tabs) {
        var result = { valid: true, passes: [], failures: [] };
        return new Promise(function (resolve, reject) {
          var first = tabs[0];
          var second = tabs[1];
          var rightPress = new Event('keydown');

          rightPress.which = 39;
          rightPress.ctrlKey = false;
          rightPress.shiftKey = false;
          rightPress.metaKey = false;

          first.dispatchEvent(rightPress);

          var secFocused = document.activeElement === second;
          result[secFocused ? 'passes' : 'failures'].push({
            target: [tabs],
            message: (secFocused ? 'Succeeded' : 'Failed') + " shifting focus to next tab with RIGHT ARROW press"
          });

          if (!secFocused) {
            result.valid = false;
          }
          return resolve(result);
        });
      };
    }, {}], 3: [function (require, module, exports) {
      'use strict';

      var closest = require('closest');
      var attributes = require('../commons/attributes');
      var keyboard = require('../commons/keyboard');

      /**
       * var logica11y = require('logica11y');
       * logica11y.tabs({
       *   tabs: 'selector-for-all-tabs-or-element-refs'
       * }).then((results) => {}).catch((e) => {});
       */
      module.exports = function (opts) {
        var results = {
          valid: true,
          resource: 'https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel'
        };
        return new Promise(function (resolve, reject) {
          var tabs = Array.prototype.slice.call(document.querySelectorAll(opts.tabs));
          var result = function result(success, data) {
            var key = success ? 'passes' : 'failures';
            if (!success) {
              results.valid = false;
            }
            results[key] = results[key] || [];
            results[key].push(data);
          };

          if (!tabs.length) {
            return reject(new Error('Failed to find the tabs'));
          }
          // TODO: do something about tabindex 0 and -1?
          // TODO: validate tab.id first so the below aria-labelledby works
          tabs.forEach(function (tab) {
            var panelId = tab.getAttribute('aria-controls');
            var panel = panelId && document.getElementById(panelId);

            /**
             * Attribute validation
             */

            // panel stuff
            if (!panel) {
              result(false, {
                message: 'Unable to find associated panel via "aria-controls" attribute',
                target: tab
              });
            } else {
              var panelResults = attributes(panel, [{
                name: 'role',
                value: 'tabpanel'
              }, {
                name: 'aria-labelledby',
                value: tab.id
              }]);

              panelResults.failures.forEach(function (fail) {
                return result(false, fail);
              });
              panelResults.passes.forEach(function (pass) {
                return result(true, pass);
              });
            }

            // ensure it is within a role="tablist"
            var tablist = closest(tab, '[role="tablist"]');

            if (!tablist) {
              result(false, {
                message: 'Unable to find parent element with role="tablist"',
                target: tab
              });
            }

            // tab stuff
            var tabResults = attributes(tab, [{
              name: 'tabindex',
              value: ['0', '-1']
            }, {
              name: 'role',
              value: 'tab'
            }, {
              name: 'aria-selected',
              value: ['true', 'false']
            }]);

            tabResults.failures.forEach(function (fail) {
              return result(false, fail);
            });
            tabResults.passes.forEach(function (pass) {
              return result(true, pass);
            });
          });

          /**
           * Keyboard events
           */

          keyboard(tabs).then(function (res) {
            res.failures.forEach(function (fail) {
              return result(false, fail);
            });
            res.passes.forEach(function (pass) {
              return result(true, pass);
            });
            resolve(results);
          });
        });
      };
    }, { "../commons/attributes": 1, "../commons/keyboard": 2, "closest": 5 }], 4: [function (require, module, exports) {

      'use strict';

      var logica11y = {
        tabs: require('./lib/tabs')
      };

      module.exports = logica11y;
    }, { "./lib/tabs": 3 }], 5: [function (require, module, exports) {
      var matches = require('matches-selector');

      module.exports = function (element, selector, checkYoSelf) {
        var parent = checkYoSelf ? element : element.parentNode;

        while (parent && parent !== document) {
          if (matches(parent, selector)) return parent;
          parent = parent.parentNode;
        }
      };
    }, { "matches-selector": 6 }], 6: [function (require, module, exports) {

      /**
       * Element prototype.
       */

      var proto = Element.prototype;

      /**
       * Vendor function.
       */

      var vendor = proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;

      /**
       * Expose `match()`.
       */

      module.exports = match;

      /**
       * Match `el` to `selector`.
       *
       * @param {Element} el
       * @param {String} selector
       * @return {Boolean}
       * @api public
       */

      function match(el, selector) {
        if (vendor) return vendor.call(el, selector);
        var nodes = el.parentNode.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; ++i) {
          if (nodes[i] == el) return true;
        }
        return false;
      }
    }, {}] }, {}, [4])(4);
});