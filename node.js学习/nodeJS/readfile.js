//readfile.js
//Ĭ���첽��ȡ�ļ�
var fs = require("fs");
fs.readFile("file.txt", "utf-8", function(error, data){
	if(error){
		console.log(error);
	}else{
		console.log(data);
	}
});
console.log("end.");