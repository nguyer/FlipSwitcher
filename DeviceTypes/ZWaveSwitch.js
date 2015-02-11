'use strict';

var util = require('util');
var Switch = require('./Switch');

var ZWaveSwitch = function(params) {
	ZWaveSwitch.super_.call(this, params);

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
		ZWaveSwitch.call(this, newParams);
		return this;
	}
}

util.inherits(ZWaveSwitch, Switch);

module.exports = ZWaveSwitch;
