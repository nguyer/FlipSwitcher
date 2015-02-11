'use strict';

var util = require('util');
var Switch = require('./Switch');

var Light = function(params) {
	Light.super_.call(this, params);
}

util.inherits(Light, Switch);

module.exports = Light;
