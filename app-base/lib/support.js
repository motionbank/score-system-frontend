'use strict';

var _       = require('underscore'),
    utils   = require('lib/utils');

  // Application-specific feature detection
  // --------------------------------------

  // Delegate to Chaplin’s support module
module.exports = utils.beget(Chaplin.support);

  // Add additional application-specific properties and methods

  // _(support).extend({
  //   someProperty: 'foo',
  //   someMethod: function(){}
  // });
