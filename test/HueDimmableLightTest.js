'use strict';

var HueDimmableLight = require('../DeviceTypes/HueDimmableLight');

describe('HueDimmableLight', function() {
	it('should convert to and from JSON', function() {
		var light = new HueDimmableLight({ on : true, brightness : 255 });
		var json = JSON.stringify(light.export());
		var newLight = new HueDimmableLight();
		newLight.import(JSON.parse(json));
		newLight.should.eql(light);
	});
});
