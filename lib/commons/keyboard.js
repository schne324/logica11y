'use strict';

// TODO: fire a keypress, keydown, then a keypress?

module.exports = (tabs) => {
  const result = { valid: true, passes: [], failures: [] }
  return new Promise((resolve, reject) => {
    const first = tabs[0];
    const second = tabs[1];
    const rightPress = new Event('keydown');

    rightPress.which = 39;
    rightPress.ctrlKey = false;
    rightPress.shiftKey = false;
    rightPress.metaKey = false;

    first.dispatchEvent(rightPress);


    const secFocused = document.activeElement === second;
    result[secFocused ? 'passes' : 'failures'].push({
      target: [tabs],
      message: `${secFocused ? 'Succeeded' : 'Failed'} shifting focus to next tab with RIGHT ARROW press`
    });

    if (!secFocused) { result.valid = false; }
    return resolve(result);
  });

};
