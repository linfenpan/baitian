var net = require("net");

var server = net.createServer();
// connection监听，也是createServer的最后一个参数回调
server.on("connection", function(socket){
	socket.on("data", function(data){
		socket.write("你好\n");
	});
	socket.on("end", function(){
		console.log("断开链接");
	})
	socket.write("欢迎光临~\n");
});

server.listen(8124, function(){
	console.log("tcp server is listening...");
});