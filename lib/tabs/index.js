'use strict';

const closest = require('closest');
const attributes = require('../commons/attributes');
const keyboard = require('../commons/keyboard');

/**
 * var logica11y = require('logica11y');
 * logica11y.tabs({
 *   tabs: 'selector-for-all-tabs-or-element-refs'
 * }).then((results) => {}).catch((e) => {});
 */
module.exports = (opts) => {
  const results = {
    valid: true,
    resource: 'https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel'
  };
  return new Promise((resolve, reject) => {
    const tabs = Array.prototype.slice.call(
      document.querySelectorAll(opts.tabs)
    );
    const result = (success, data) => {
      const key = success ? 'passes' : 'failures';
      if (!success) { results.valid = false; }
      results[key] = results[key] || [];
      results[key].push(data);
    };

    if (!tabs.length) { return reject(new Error('Failed to find the tabs')); }
    // TODO: do something about tabindex 0 and -1?
    // TODO: validate tab.id first so the below aria-labelledby works
    tabs.forEach((tab) => {
      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId && document.getElementById(panelId);

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
         const panelResults = attributes(panel, [{
           name: 'role',
           value: 'tabpanel'
         }, {
           name: 'aria-labelledby',
           value: tab.id
         }]);

         panelResults.failures.forEach((fail) => result(false, fail));
         panelResults.passes.forEach((pass) => result(true, pass));
       }

      // ensure it is within a role="tablist"
      const tablist = closest(tab, '[role="tablist"]');

      if (!tablist) {
        result(false, {
          message: 'Unable to find parent element with role="tablist"',
          target: tab
        });
      }

      // tab stuff
      const tabResults = attributes(tab, [{
        name: 'tabindex',
        value: ['0', '-1']
      }, {
        name: 'role',
        value: 'tab'
      }, {
        name: 'aria-selected',
        value: ['true', 'false']
      }])

      tabResults.failures.forEach((fail) => result(false, fail));
      tabResults.passes.forEach((pass) => result(true, pass));
    });

    /**
     * Keyboard events
     */

    keyboard(tabs)
      .then((res) => {
        res.failures.forEach((fail) => result(false, fail));
        res.passes.forEach((pass) => result(true, pass));
        resolve(results);
      });
  });
};
