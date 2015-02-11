'use strict';

var Switch = function(params) {
	if (params) {
		if (params.hasOwnProperty('on')) this.on = params.on;
	}

	this.export = function() {
		return this;
	}

	this.import = function(params) {
		Switch.call(this, params);
		return this;
	}
}

module.exports = Switch;
