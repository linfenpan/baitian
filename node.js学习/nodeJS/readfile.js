//readfile.js
//默认异步读取文件
var fs = require("fs");
fs.readFile("file.txt", "utf-8", function(error, data){
	if(error){
		console.log(error);
	}else{
		console.log(data);
	}
});
console.log("end.");