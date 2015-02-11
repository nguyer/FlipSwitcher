'use strict';

var Thermostat = function(params) {
	if (params) {
		if (params.hasOwnProperty('mode')) this.mode = params.mode;
		if (params.hasOwnProperty('heat')) this.heat = params.heat;
		if (params.hasOwnProperty('cool')) this.cool = params.cool;
		if (params.hasOwnProperty('temperature')) this.temperature = params.temperature;
		if (params.hasOwnProperty('humidity')) this.humidity = params.humidity;
		if (params.hasOwnProperty('state')) this.state = params.state;
	}

	this.export = function() {
		return this;
	}

	this.import = function(params) {
		Thermostat.call(this, params);
	}
}

module.exports = Thermostat;
