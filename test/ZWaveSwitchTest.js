'use strict';

var ZWaveSwitch = require('../DeviceTypes/ZWaveSwitch');

describe('ZWaveSwitch', function() {
	it('should convert to and from JSON', function() {
		var light = new ZWaveSwitch({ on: true });
		var json = JSON.stringify(light.export());
		var newLight = new ZWaveSwitch();
		newLight.import(JSON.parse(json));
		newLight.should.eql(light);
	});
});
