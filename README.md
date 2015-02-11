FlipSwitcher
====================
*A Cool Tool To Switch Your Flips*

An extremely modular home automation server written in Node.js with built in support for Philips Hue and Z-Wave devices*.

<sub>**With the help of the companion FlipWave server and a USB Z-Wave controller*<sub>

# Installation
	$ git clone https://github.com/nguyer/flipswitcher
	$ cd flipswitcher
	$ npm install flipswitcher


# Starting the Server

	$ npm start

# Configuration
The server is configured by a series of JSON files in the `config` directory. There are a few samples in there to help get you started.

## Device Configuration
Each device is represented by a JSON object. Here's an example of what a Philips Hue Light could look like:


### Sample Device
````
{
	"id": "huelight",
	"name": "My Hue Light",
	"description": "A Sample Philips Hue Light",
	"deviceType": "HueLight",
	"state": {
		"on": false,
		"color": [
			255,
			255,
			255
		],
		"brightness": 255
	},
	"statusUrl": "http://192.168.1.129/api/295c02e0a8e38cf3feaef3072058bf/lights/1",
	"updateUrl": "http://192.168.1.129/api/295c02e0a8e38cf3feaef3072058bf/lights/1/state"
}
````

### Device Fields

| Field Name  | Type   | Description | Notes |
|-------------|--------|-------------|-------|
| id          | String | The devices's unique identifier. This is used as the device URL. | This field must be unique among all of your devices |
| name        | String | The device's friendly name. This will usually appear on user interfaces | |
| description | String | A more detailed description of the device. This may be used by a user interface | Optional |
| state       | Object | The device's current state | |
| statusUrl   | String | The URL to GET when querying the device state | This is not implemented yet |
| updateUrl   | String | The URL to PUT to when changing the device state | &nbsp; |

# Usage

After setting up your configuration files and starting the server (restart if you edit your configs), you should be able to query the current state of your devices by doing an HTTP GET on:

	http://localhost:3000/api/v1.0/devices

To query the status of a specific device, simply append the device's unique ID to the url:

	http://localhost:3000/api/v1.0/devices/huelight

To update the device, perform an HTTP PUT to:

	http://localhost:3000/api/v1.0/devices/huelight/state

And include an updated state object in the request payload, with a Content-Type of application/JSON:

````
{
	"on": true,
	"color": [
		255,
		0,
		0
	]
}
````
