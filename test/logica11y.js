'use strict';

describe('logica11y', function () {
  var logica11y = window.logica11y;

  it('should export the right stuff', function () {
    assert.equal('function', typeof logica11y.tabs);
  });
});
