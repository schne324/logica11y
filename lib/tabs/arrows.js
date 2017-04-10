'use strict';

const keyVent = require('../commons/events/keyboard');

module.exports = (tabs) => {
  const result = { passes: [], failures: [] };
  const first = tabs[0];
  const second = tabs[1];

  // test right arrow functionality
  // first => second
  const doesFocusNext = keyVent(first, 39, () => document.activeElement === second);
  result[doesFocusNext ? 'passes' : 'failures'].push({
    target: [tabs],
    message: `${doesFocusNext ? 'Succeeded' : 'Failed'} shifting focus to next tab with RIGHT ARROW press`
  });

  // test left arrow functionality
  // second => first
  second.focus();
  const doesFocusPrev = keyVent(second, 37, () => document.activeElement === first);
  result[doesFocusPrev ? 'passes' : 'failures'].push({
    target: tabs,
    message: `${doesFocusPrev ? 'Succeeded' : 'Failed'} shifting focus to next tab with LEFT ARROW press`
  });

  result.valid = !result.failures.length;
  return result;
};
