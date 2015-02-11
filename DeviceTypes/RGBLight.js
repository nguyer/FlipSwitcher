'use strict';

var util = require('util');
var DimmableLight = require('./DimmableLight');

var RGBLight = function(params) {
	RGBLight.super_.call(this, params);

	if (params) {
		if (params.hasOwnProperty('color')) this.color = params.color;
	}

	this.import = function(params) {
		RGBLight.call(this,params);
		return this;
	}
}

util.inherits(RGBLight, DimmableLight);

module.exports = RGBLight;
