'use strict';

var ZWaveThermostat = require('../DeviceTypes/ZWaveThermostat');

describe('ZWaveThermostat', function() {
	it('should convert to and from JSON', function() {
		var thermostat = new ZWaveThermostat({
			temperature: 72,
			humidity: 35,
			mode: 0,
			state: 'Idle',
			heat: 69,
			cool: 72
		});
		var json = JSON.stringify(thermostat.export());
		var newThermostat = new ZWaveThermostat();
		newThermostat.import(JSON.parse(json));
		newThermostat.should.eql(thermostat);
		newThermostat.temperature.should.equal(72);
	});
});
