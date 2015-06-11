var fs = require("fs");
function log(){
	console.log.apply(console, arguments);
}
// 文件操作封装
var oop = {
	readFile: function(fullName){
		return fs.readFileSync(fullName, {
			encoding: "utf8"
		});
	}
	,writeFile: function(fullName, text){
		try{
			// 文件存在的话，重写"可读写"状态
			if(this.isFileExist(fullName)){
				this.resetFileAttr(fullName);
			}
			if(text){
				// 写入文件
				fs.writeFileSync(fullName, text, {
					encoding: "utf8"
				});
				log("write success:" + fullName);
			}else{
				log("write file error:file content is null:" + fullName);
			}
			
		}catch(e){
			log("write file error:" + fullName);
		}
	}
	// 重设文件的"可读写状态"
	,resetFileAttr: function(fullName){
		// 33206 是 A 状态
		fs.chmodSync(fullName, 33206);
	}
	// 文件存在否？
	,isFileExist: function(fullName){
		return fs.existsSync(fullName);
	}
};
module.exports = oop;