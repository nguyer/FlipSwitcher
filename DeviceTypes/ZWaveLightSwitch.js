'use strict';

var util = require('util');
var Switch = require('./Light');

var ZWaveLightSwitch = function(params) {
	ZWaveLightSwitch.super_.call(this, params);

	this.export = function() {
		var output = {
			classes: {
				'37': {
					'0': {
						value: this.on
					}
				}
			}
		}
		return output;
	}

	this.import = function(params) {
		var newParams = {
			on: params.classes['37']['0'].value
		}
		ZWaveLightSwitch.call(this, newParams);
		return this;
	}
}

util.inherits(ZWaveLightSwitch, Switch);

module.exports = ZWaveLightSwitch;
