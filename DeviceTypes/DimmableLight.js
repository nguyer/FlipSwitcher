'use strict';

var util = require('util');
var Light = require('./Light');

var DimmableLight = function(params) {
	DimmableLight.super_.call(this, params);

	if (params) {
		if (params.hasOwnProperty('brightness')) this.brightness = params.brightness;
	}

	this.import = function(params) {
		DimmableLight.call(this, params);
		return this;
	}
}

util.inherits(DimmableLight, Light);

module.exports = DimmableLight;
