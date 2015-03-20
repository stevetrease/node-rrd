var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var rrd = require('rrd');



// topic to file mapping
var mapping = {};
mapping["sensors/power/0"] = { file: "currentcost-w0.rrd", ds: "WATTS" };
mapping["sensors/power/1"] = { file: "currentcost-w1.rrd", ds: "WATTS" };
mapping["sensors/power/2"] = { file: "currentcost-w2.rrd", ds: "WATTS" };
mapping["sensors/power/3"] = { file: "currentcost-w3.rrd", ds: "WATTS" };
mapping["sensors/power/4"] = { file: "currentcost-w4.rrd", ds: "WATTS" };
mapping["sensors/power/5"] = { file: "currentcost-w5.rrd", ds: "WATTS" };
mapping["sensors/power/6"] = { file: "currentcost-w6.rrd", ds: "WATTS" };
mapping["sensors/power/7"] = { file: "currentcost-w7.rrd", ds: "WATTS" };
mapping["sensors/power/8"] = { file: "currentcost-w8.rrd", ds: "WATTS" };
mapping["sensors/power/9"] = { file: "currentcost-w9.rrd", ds: "WATTS" };
mapping["sensors/power/WeMo Insight A"] = { file: "wemo-A.rrd", ds: "WATTS" };
mapping["sensors/power/WeMo Insight B"] = { file: "wemo-B.rrd", ds: "WATTS" };
mapping["sensors/power/WeMo Insight C"] = { file: "wemo-C.rrd", ds: "WATTS" };
mapping["sensors/temperature/garage"] = { file: "currentcost-temp.rrd", ds: "TEMP" };
mapping["sensors/temperature/attic"] = { file: "arduino-attic.rrd", ds: "one" };
mapping["sensors/temperature/jeenode-11"] = { file: "jeenode-11-d1.rrd", ds: "one" };
mapping["sensors/temperature/jeenode-15"] = { file: "jeenode-15-d1.rrd", ds: "one" };
mapping["sensors/temperature/egpd"] = { file: "weather_egpd_temp.rrd", ds: "TEMP" };
mapping["sensors/humidity/jeenode-11"] = { file: "jeenode-11-d2.rrd", ds: "one" };
mapping["sensors/humidity/jeenode-15"] = { file: "jeenode-15-d2.rrd", ds: "one" };
mapping["sensors/co/jeenode-15"] = { file: "jeenode-15-d3.rrd", ds: "one" };
mapping["sensors/no2/jeenode-15"] = { file: "jeenode-15-d4.rrd", ds: "one" };
mapping["sensors/boiler/in"] = { file: "jeenode-11-dX.rrd", ds: "one" };



var mqtt = require('mqtt');
var mqttclient = mqtt.connect(config.mqtt.url, function(err, client) {
	keepalive: 1000
});




mqttclient.on('connect', function() {
	mqttclient.subscribe('sensors/+/+');

	mqttclient.on('message', function(topic, message) {
		
		if (topic != "sensors/power/U") {	
			console.log(topic, message.toString());
			
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