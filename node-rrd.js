console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
        case 'development':
                console.log ("echo development mode");
                var config = require('./config.json');
                break;
        case 'production':
        default:
                console.log ("echo production mode");
                var config = require('./config.json');
}

var mapping = require('./mappings.json');


var mqtt = require('mqtt');
var mqttclient = mqtt.connect(config.mqtt.host, {
	username: "bridge",
	password: "qdJ0jrkHgOUWMioMu0iOteDnhnjpqu2Riv6E2qoJAgtEUrqRwtWjVkGPuUvfbwt"
});



mqttclient.on('connect', function() {
	mqttclient.subscribe('sensors/+/+');

	mqttclient.on('message', function(topic, message) {
		// console.error(topic, message.toString());
		
		if (mapping[topic] === undefined) {
			console.error (topic + ": no mapping array entry");
		} else {		
			// what will the rrd file be called? (removing /s from the string)
			var filename = "data/" + mapping[topic].file;
			
			var value = message.toString();
			// var now = Math.ceil((new Date).getTime() / 1000);
			
			console.log ("rrdtool update " + filename + " N:" + value);
		}
	});
});
