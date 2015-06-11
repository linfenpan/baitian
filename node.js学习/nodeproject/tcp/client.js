var net = require("net");
// port是端口，path是server的路径
var client = net.connect({port: 8124, path: ""}, function(){
	console.log("client connected");
	client.write("hello!\r\n");
});

client.on("data", function(data){
	console.log(data.toString());
	client.end();
});

client.on("end", function(){
	console.log("client is disconnected");
});