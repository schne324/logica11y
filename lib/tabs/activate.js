'use strict';

const mouseVents = require('../commons/events/mouse');
const isVisible = require('axe-core').commons.dom.isVisible;
const getPanel = (t) => document.getElementById(t.id || '');

module.exports = (tabs, timeout) => {
  const result = { passes: [], failures: [] };
  return new Promise((resolve, reject) => {
    let ariaSelectedFailed = false;
    const pairs = tabs.map((tab) => {
      return { tab: tab, panel: getPanel(tab) };
    });

    // mouse activation / aria-selected stuff
    mouseVents(pairs, (data) => {
      const fails = pairs.filter((pair) => {
        const val = (pair.tab === data.tab) ? 'true' : 'false'
        return pair.tab.getAttribute('aria-selected') === val;
      });
      if (fails.length) { ariaSelectedFailed = true; }

      return data.panel && isVisible(data.panel)
    }, timeout).then((qualified) => {
      // activation
      result[qualified.length ? 'passes' : 'failures'].push({
        target: tabs,
        message: `${qualified.length ? 'Succeeded' : 'Failed'} activating panels with mouse`
      });

      // aria-selected
      result[ariaSelectedFailed ? 'failures' : 'passes'].push({
        target: tabs,
        message: `${ariaSelectedFailed ? 'Failed' : 'Succeeded'} managing aria-selected attribute on tabs`
      });

      result.valid = !result.failures.length;
      return resolve(result);
    });
  });
}
