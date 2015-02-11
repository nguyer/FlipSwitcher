'use strict';

var util = require('util');
var DimmableLight = require('./DimmableLight');

var HueDimmableLight = function(params) {
	HueDimmableLight.super_.call(this, params);

	this.export = function() {
		var output = {}
		if (this.hasOwnProperty('on')) output.on = this.on;
		if (this.hasOwnProperty('brightness')) output.bri = this.brightness;
		return output;
	};

	this.import = function(params) {
		var newParams = {};
		if (params.hasOwnProperty('bri')) {
			newParams.brightness = params.bri;
		}
		if (params.hasOwnProperty('on')) newParams.on = params.on;
		HueDimmableLight.call(this, newParams);
		return this;
	};
}
module.exports = HueDimmableLight;

util.inherits(HueDimmableLight, DimmableLight);
