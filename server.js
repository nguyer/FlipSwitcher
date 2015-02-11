'use strict';

var q = require('q')
var fs = require('fs');
var path = require('path');
var Hapi = require('hapi');
var https = require('https');
var uuid = require('node-uuid');
var requestjs = require('request');

var server = new Hapi.Server();
var port = process.env.FLIPSWITCHER_PORT || 3000;
var apiPrefix = '/api/v1.0';
var devices = [];
var groups = [];
var modes = [];
var updateSubscriptions = [];

function writeDeviceState(devices, callback) {
	fs.writeFile(path.join(__dirname, 'devices.json'), JSON.stringify(devices, null, 4), callback);
}

function readDeviceState(callback) {
	fs.readFile(path.join(__dirname, 'config', 'devices.json'), callback);
}

function readGroups(callback) {
	fs.readFile(path.join(__dirname, 'config', 'groups.json'), callback);
}

function readModes(callback) {
	fs.readFile(path.join(__dirname, 'config', 'modes.json'), callback);
}

readDeviceState(function(err, data) {
	devices = JSON.parse(data);
});

readGroups(function(err, data) {
	groups = JSON.parse(data);
});

readModes(function(err, data) {
	modes = JSON.parse(data);
});

function getDeviceById(deviceId) {
	for (var i = 0; i < devices.length; i++) {
		if (devices[i].id === deviceId) {
			return devices[i];
		}
	}
	return null;
}

function getGroupById(groupId) {
	for (var i = 0; i < groups.length; i++) {
		if (groups[i].id === groupId) {
			return groups[i];
		}
	}
	return null;
}

server.connection({ port : port});

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: 'public'
		}
	}
});

server.route({
	method: 'GET',
	path: apiPrefix + '/devices',
	handler: function (request, reply) {
		reply(devices);
	}
});

server.route({
	method  : 'GET',
	path    : apiPrefix + '/devices/{deviceId}',
	handler : function (request, reply) {
		var deviceId = request.params.deviceId;
		var device = getDeviceById(deviceId);
		if (device) {
			reply(device);
		}
		else {
			reply().code(404);
		}
	}
});

server.route({
	method  : 'GET',
	path    : apiPrefix + '/devices/{deviceId}/state',
	handler : function (request, reply) {
		var deviceId = request.params.deviceId;
		var device = getDeviceById(deviceId);
		if (device) {
			reply(device.state);
		}
		else {
			reply().code(404);
		}
	}
});


server.route({
	method  : 'POST',
	path    : apiPrefix + '/devices',
	handler : function (request, reply) {
		var device = request.payload;

		if (!device.deviceId) {s
			device.id = uuid.v4();
		}

		devices.push(device);
		writeDeviceState(devices);
		reply().code(201).header('Location', apiPrefix + '/devices/' + device.id);
	}
});

server.route({
	method  : 'PUT',
	path    : apiPrefix + '/devices/{deviceId}/state',
	handler : function (request, reply) {
		var deviceId = request.params.deviceId;
		var device = getDeviceById(deviceId);
		if (device) {
			updateDeviceState(device, request.payload, request.query.master);
			writeDeviceState(devices);
			reply({response: 'Device sucessfully updated'}).code(200);
		}
		else {
			reply().code(404);
		}
	}
});

server.route({
	method  : 'DELETE',
	path    : apiPrefix + '/devices/{deviceId}',
	handler : function (request, reply) {
		delete devices[request.params.deviceId];
		writeDeviceState(devices);
		reply();
	}
});

server.route({
	method  : 'GET',
	path    : apiPrefix + '/updates',
	handler : function (request, reply) {
		updateSubscriptions.push(reply);
	}
});


server.route({
	method  : 'GET',
	path    : apiPrefix + '/types/{deviceType}',
	handler : function (request, reply) {

		var DeviceType = require('./DeviceTypes/' + request.params.deviceType);
		var deviceType = new DeviceType();

		var group = [];
		for (var i = 0; i < devices.length; i++) {
			var device = devices[i];
			var ThisDeviceType = require('./DeviceTypes/' + device.deviceType);
			var thisDeviceType = new ThisDeviceType();
			if (thisDeviceType instanceof DeviceType) {
				group.push(device);
			}
		}
		reply(group);
	}
});

server.route({
	method  : 'GET',
	path    : apiPrefix + '/groups',
	handler : function (request, reply) {
		reply(groups);
	}
});

server.route({
	method  : 'GET',
	path    : apiPrefix + '/groups/{groupId}',
	handler : function (request, reply) {
		var groupId = request.params.groupId;
		var group = getGroupById(groupId);
		var response = [];
		if (group) {
			for (var i = 0; i < group.devices.length; i++) {
				var deviceId = group.devices[i];
				var device = getDeviceById(deviceId);
				response.push(device);
			}
			reply(response);
		}
		else {
			reply().code(404);
		}
	}
});

server.route({
	method  : 'PUT',
	path    : apiPrefix + '/groups/{groupId}',
	handler : function (request, reply) {
		var groupId = request.params.groupId;
		var group = getGroupById(groupId);
		if (group) {
			for (var i = 0; i < group.devices.length; i++) {
				var deviceId = group.devices[i];
				var device = getDeviceById(deviceId);
				updateDeviceState(device, request.payload);
			}
			writeDeviceState(devices);
			reply({response: 'Device sucessfully updated'}).code(200);
		}
		else {
			reply().code(404);
		}
	}
});

function updateDeviceState(device, state, masterUpdate) {
	var masterState = state;
	var DeviceType = require('./DeviceTypes/' + device.deviceType);
	var deviceType = new DeviceType(state);

	if (masterUpdate) {
		// Device was updated by its master
		deviceType.import(state);

		// Update fields in state
		state = {};
		for (var fieldName in deviceType) {
			if (fieldName !== 'import' && fieldName !== 'export')
			state[fieldName] = deviceType[fieldName];
		}

		console.log('Master updated state: ' + JSON.stringify(masterState, null, 4));
	}
	else {
		// Device is being updated by something else
		masterState = deviceType.export();
		console.log('Sending ' + device.updateUrl + ' updated state ' + JSON.stringify(masterState, null, 4));

		// Send the updated state to the master
		requestjs({
			method : 'put',
			url    : device.updateUrl,
			json   : masterState
		}, function(err, res) {
			debugger;
			if (err) {
				console.error(err);
			}
		});
	}

	// Update local device state
	for (var fieldName in state) {
		device.state[fieldName] = state[fieldName];
	}

	// Update all subscribers
	while (updateSubscriptions.length > 0) {
		var update = updateSubscriptions.pop();
		update({
			id : device.id,
			state : device.state
		});
	}

	// Update any subscribers of the change
	if (device.hasOwnProperty('subscribers')) {
		q.all(device.subscribers.map(function(subscriberUrl) {
			requestjs({
				method : 'put',
				url    : subscriberUrl,
				json   : state
			});
		})).then(function() {
			console.log('All subscribers updated');
		}, function(err) {
			console.err(err);
		});
	}
}

server.start(function () {
	console.log('Server running at:', server.info.uri);
});
