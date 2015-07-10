console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
        case 'development':
                console.log ("development mode");
                var config = require('./config.json');
                break;
        case 'production':
        default:
                console.log ("production mode");
                var config = require('./config.json');
}

var mapping = require('./mappings.json');
var fs = require('fs');
var path = require('path');
var rrd = require('rrd');




var mqtt = require('mqtt');
var mqttclient = mqtt.connect(config.mqtt.url, function(err, client) {
	keepalive: 1000
});




mqttclient.on('connect', function() {
	mqttclient.subscribe('sensors/+/+');

	mqttclient.on('message', function(topic, message) {
	//  console.log(topic, message.toString());
		
		if (mapping[topic] === undefined) {
			console.log (topic + ": no mapping array entrys");
		} else {		
			// what will the rrd file be called? (removing /s from the string)
			var filename = "data/" + mapping[topic].file;
			
			// does it exist?
			if (path.existsSync(filename)) {
				// console.log(filename + " exists");
				var value = message.toString();
				var now = Math.ceil((new Date).getTime() / 1000);
				rrd.update(filename, mapping[topic].ds, [[now, value].join(':')], function (error) { 
						if (error) console.log(topic + ": error: ", error);
				});
			} else {
				console.log(topic + ": " + filename + " does not exist");
			}
		}
	});
});
