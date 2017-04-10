'use strict';

const keyTypes = ['keydown', 'keypress', 'keyup'];

/**
 * Tries keydown, keypress, and keyup to satisfy the `qualify` function
 * @param  {HTMLElement} target    the target element to fire the keyboard events on
 * @param  {Number}      which     the key code
 * @param  {Function}    qualify   the function to be assesed after each event is fired
 * @return {Boolean}               whether or not `qualify` returned true on any of the event types
 */
module.exports = (target, which, qualify) => {
  let qualified = false;

  keyTypes.forEach((eventType) => {
    if (qualified) { return; }
    const thisEvent = new Event(eventType);
    thisEvent.which = which;
    thisEvent.ctrlKey = false;
    thisEvent.shiftKey = false;
    thisEvent.metaKey = false;
    target.dispatchEvent(thisEvent);
    if (qualify()) { qualified = true; }
  });

  return qualified;
};
