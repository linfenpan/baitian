var fs = require("fs");
var path = require("path");

// stream 只能操作单个文件，写入流的目录不存在，会报错哦~
// var readStream = fs.createReadStream("./src/Bitmap1choco.png");
// var writeStream = fs.createWriteStream("./dest/Bitmap1choco.png");
//readStream.pipe(writeStream);
/* 一般的流操作，有3步骤
readStream.on("data", function(chunk){
	if(writeStream.write(chunk) === false){
		// 如果写入失败，则停止
		readStream.pause();
	}
});

writeStream.on("drain", function(){
	// 写入完成，重新开始readStream
	readStream.resume();
});

readStream.on("end", function(){
	writeStream.end();
});
// 一个pipe等于上面几步
// readStream.pipe(writeStream);
*/

// 那写一个复制文件的操作
var dest = "./dest", src = "./src";
function copy(src, dst){
	fs.readdir(src, function(err, paths){
		if(err){
			throw err;
		};
		if(!fs.existsSync(dst)){
			// 目录不存在，则创建之~
			fs.mkdirSync(dst);
		};
		
		// 遍历文件
		paths.forEach(function(p){
			// 创建真正的文件
			var _src = path.join(src, p),
				_dst = path.join(dst, p),
				readStream, writeStream;
			// 判定是否文件
			var stat = fs.statSync(_src);
			if(stat.isFile()){
				// 创建文件
				readStream = fs.createReadStream(_src);
				writeStream = fs.createWriteStream(_dst);
				// 管道传输~
				readStream.pipe(writeStream);
			}else if(stat.isDirectory()){
				// 再次遍历目录
				copy(_src, _dst);
			}		
		});
		
	});
};
copy(src, dest);