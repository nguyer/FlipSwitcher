'use strict';

var DimmableLight = require('../DeviceTypes/DimmableLight');

describe('DimmableLight', function() {
	it('should convert to and from JSON', function() {
		var light = new DimmableLight({ on : true, brightness : 255 });
		var json = JSON.stringify(light.export());
		var newLight = new DimmableLight();
		newLight.import(JSON.parse(json));
		newLight.should.eql(light);
	});
});
