'use strict';

/**
 * Attribute validator
 * @param  {HTMLElement} el    element whose attributes are being assessed
 * @param  {Array}       attrs array of name/value attribute pairs (see example)
 * @return {Object}            the result object
 *
 * attributes(el, [{
 *   name: 'aria-live',
 *   value: ['polite', 'assertive']
 * }, {
 *   name: 'role',
 *   value: 'tab'
 * }, {
 *   name: 'aria-controls'
 * }]);
 */

module.exports = (el, attrs) => {
  const result = { valid: true, failures: [], passes: [] };

  attrs.forEach((attr) => {
    const actual = el.getAttribute(attr.name);
    if (!!actual && !attr.value) { return; } // valid. element has the attribute (any value is allowed).

    const expected = Array.isArray(attr.value) ? attr.value : [attr.value];
    const isFail = !actual || expected.indexOf(actual) === -1;
    const key = isFail ? 'failures' : 'passes';

    result[key].push({
      message: `${isFail ? 'Expected' : 'Confirmed'} ${attr.name} attribute to have a value of ${expected.join(' or ')}`,
      target: el
    });

    if (isFail) { result.valid = false; }
  });

  return result;
};
