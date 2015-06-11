//event.js
var EventEmitter = require("events").EventEmitter;
//create a new event
var event = new EventEmitter();

//listen event
event.on("some_event", function(){
	console.log("some events happen");
});

//trigger event
setTimeout(function(){
	event.emit("some_event");
}, 1000);