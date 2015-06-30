var config = require('./config.json');
var mapping = require('./mappings.json');
var fs = require('fs');
var path = require('path');
var rrd = require('rrd');






var mqtt = require('mqtt');
var mqttclient = mqtt.connect(config.mqtt.url, function(err, client) {
	keepalive: 1000
});




mqttclient.on('connect', function() {
	// mqttclient.subscribe('sensors/+/+');

	mqttclient.on('message', function(topic, message) {
		console.log(topic, message.toString());
		
		if (mapping[topic] === undefined) {
			console.log ("no mapping array entry for " + topic)
		} else {		
			// what will the rrd file be called? (removing /s from the string)
			var filename = "data/" + mapping[topic].file;
			
			// does it exist?
			if (path.existsSync(filename)) {
				// console.log(filename + " exists");
				var value = message.toString();
				var now = Math.ceil((new Date).getTime() / 1000);
				rrd.update(filename, mapping[topic].ds, [[now, value].join(':')], function (error) { 
						if (error) console.log("Error:", error);
				});
			} else {
				console.log(filename + " for " + topic + " does not exist");
			}
		}
	});
});
