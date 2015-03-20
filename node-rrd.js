var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var rrd = require('rrd');



// topic to file mapping
var mapping = {};
mapping["sensors/power/0"] = "currentcost-w0.rrd";
mapping["sensors/power/1"] = "currentcost-w1.rrd";
mapping["sensors/power/2"] = "currentcost-w2.rrd";
mapping["sensors/power/3"] = "currentcost-w3.rrd";
mapping["sensors/power/4"] = "currentcost-w4.rrd";
mapping["sensors/power/5"] = "currentcost-w5.rrd";
mapping["sensors/power/6"] = "currentcost-w6.rrd";
mapping["sensors/power/7"] = "currentcost-w7.rrd";
mapping["sensors/power/8"] = "currentcost-w8.rrd";
mapping["sensors/power/9"] = "currentcost-w9.rrd";
mapping["sensors/power/WeMo Insight A"] = "wemo-A.rrd";
mapping["sensors/power/WeMo Insight B"] = "wemo-B.rrd";
mapping["sensors/power/WeMo Insight C"] = "wemo-C.rrd";
mapping["sensors/temperature/garage"] = "currentcost-temp.rrd";
mapping["sensors/temperature/attic"] = "arduino-attic.rrd";
mapping["sensors/temperature/jeenode-11"] = "jeenode-11-d1.rrd";
mapping["sensors/temperature/jeenode-15"] = "jeenode-15-d1.rrd";
mapping["sensors/temperature/egpd"] = "weather_egpd_temp.rrd";



var mqtt = require('mqtt');
var mqttclient1 = mqtt.connect(config.mqtt.url, function(err, client) {
	keepalive: 1000
});
var mqttclient2 = mqtt.connect(config.mqtt.url, function(err, client) {
	keepalive: 1000
});




mqttclient1.on('connect', function() {
	mqttclient1.subscribe('sensors/power/+');
	mqttclient1.on('message', function(topic, message) {
		console.log(topic, message.toString());
		
		// what will the rrd file be called? (removing /s from the string)
		var filename = "data/" + mapping[topic];
		
		// does it exist?
		if (path.existsSync(filename)) {
			// console.log(filename + " exists");
			var value = message.toString();
			var now = Math.ceil((new Date).getTime() / 1000);
			rrd.update(filename, "WATTS", [[now, value].join(':')], function (error) { 
					if (error) console.log("Error:", error);
			});
		} else {
			if (topic != "sensors/power/U") {
				console.log(filename + " for " + topic + " does not exist");
			}
		}
	});
});



mqttclient2.on('connect', function() {
	mqttclient2.subscribe('sensors/temperature/+');
	mqttclient2.on('message', function(topic, message) {
		console.log(topic, message.toString());
		
		// what will the rrd file be called? (removing /s from the string)
		var filename = "data/" + mapping[topic];
		
		// does it exist?
		if (path.existsSync(filename)) {
			// console.log(filename + " exists");
			var value = message.toString();
			var now = Math.ceil((new Date).getTime() / 1000);
			rrd.update(filename, "TEMP", [[now, value].join(':')], function (error) { 
					if (error) console.log("Error:", error);
			});
		} else {
			console.log(filename + " for " + topic + " does not exist");
		}
	});
});

