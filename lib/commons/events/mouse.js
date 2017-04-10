'use strict';

const mouseTypes = ['mousedown', 'mouseup', 'click'];

/**
 * Fires mousedown, mouseup, and click events
 * (in that order) and returns qualify data
 * @param  {Array}    data    array of tab - panel pairs
 * @param  {Function} qualify the qualify function (returns bool)
 * @param  {Number}   timeout ms timeout before calling qualify function
 * @return {Array}            array of qualified pairs
 */
module.exports = (data, qualify, timeout) => {
  return new Promise((resolve, reject) => {
    let dataIndex = 0;
    const qualified = [];

    next();

    function fireEvents() {
      const thisData = data[dataIndex];
      // fire all of the events
      mouseTypes.forEach((eventType) => {
        const e = new Event(eventType);
        thisData.tab.dispatchEvent(e);
      });

      setTimeout(() => {
        if (qualify(thisData)) { qualified.push(thisData); }
        dataIndex++;
        next();
      }, timeout || 0);
    }

    function next() {
      if (!data[dataIndex]) { return done(); }
      fireEvents();
    }

    function done() {
      return resolve(qualified);
    }
  });
};
