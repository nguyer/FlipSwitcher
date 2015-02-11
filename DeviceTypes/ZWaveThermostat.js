'use strict';

var util = require('util');
var Thermostat = require('./Thermostat')

var ZWaveThermostat = function(params) {
	ZWaveThermostat.super_.call(this, params);

	this.export = function() {
		var output = {
			classes: {}
		};
		if (this.hasOwnProperty('temperature')) {
			if (!output.classes['49']) output.classes['49'] = {};
			output.classes['49']['1'] = {
				value: this.temperature
			};
		}
		if (this.hasOwnProperty('humidity')) {
			if (!output.classes['49']) output.classes['49'] = {};
			output.classes['49']['5'] = {
				value: this.humidity
			};
		}
		if (this.hasOwnProperty('mode')) {
			if (!output.classes['64']) output.classes['64'] = {};
			output.classes['64']['0'] = {
				value: this.mode
			};
		}
		if (this.hasOwnProperty('state')) {
			if (!output.classes['66']) output.classes['66'] = {};
			output.classes['66']['0'] = {
				value: this.state
			};
		}
		if (this.hasOwnProperty('heat')) {
			if (!output.classes['67']) output.classes['67'] = {};
			output.classes['67']['1'] = {
				value: this.heat
			};
		}
		if (this.hasOwnProperty('cool')) {
			if (!output.classes['67']) output.classes['67'] = {};
			output.classes['67']['2'] = {
				value: this.cool
			};
		}
		return output;
	}

	this.import = function(params) {
		var newParams = {};
		if (params.classes) {
			if (params.classes['49']) {
				if (params.classes['49']['1']) {
					newParams.temperature = params.classes['49']['1'].value;
				}
				if (params.classes['49']['5']) {
					newParams.humidity = params.classes['49']['5'].value;
				}
			}
			if (params.classes['64']) {
				if (params.classes['64']['0']) {
					newParams.mode = params.classes['64']['0'].value;
				}
			}
			if (params.classes['66']) {
				if (params.classes['66']['0']) {
					newParams.state = params.classes['66']['0'].value;
				}
			}
			if (params.classes['67']) {
				if (params.classes['67']['1']) {
					newParams.heat = params.classes['67']['1'].value;
				}
				if (params.classes['67']['2']) {
					newParams.cool = params.classes['67']['2'].value;
				}
			}
		}
		ZWaveThermostat.call(this, newParams);
		return this;
	}
}

util.inherits(ZWaveThermostat, Thermostat);

module.exports = ZWaveThermostat;
