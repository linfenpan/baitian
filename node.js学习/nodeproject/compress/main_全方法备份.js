var fs = require("fs");
// 压缩html，好像对js文件不怎么感兴趣...
var minify = require('html-minifier').minify;
// 压缩脚本
var UglifyJS = require("uglify-js");
// YUI的压缩器
var yuicompressor = require('yuicompressor'); 

var nextFile = [];

fs.readFile('config.json', function(err, data){
	if(err){
		console.error(err);
	}else{
		nextFile = [];
		var json = JSON.parse(data.toString());
		var target = json.target, relative = json.relative || "", files = json.files;
		
		for(var i in files){
			var item = files[i];
			// 加载file
			saveNextFile(relative + item);
		}
		// 创建目标文件 + 开始合并
		createTargetFile(target);
		
		
		console.log(target);
	}
});

function saveNextFile(file){
	nextFile.push(file);
};
// 创建目标文件
function createTargetFile(target){
	fs.unlink(target, function(err){
		if(err){
			console.log("文件删除失败:" + target);
			console.log("尝试创建文件...");
		}
		fs.open(target, "a+", function(err, fd){
			if(err){
				console.log("文件创建失败..中断执行...");
			}else{
				console.log("文件创建成功:" + target);
				// 插入下一个文件
				appendNextFile(target);
			}
		});
	});
};
// 插入下一个文件
function appendNextFile(target){
	if(nextFile.length > 0){
		var name = nextFile.shift();
		console.log("加载文件:" + name);
		fs.readFile(name, function(err, data){
			fs.appendFile(target, data + '\n', function(err){
				appendNextFile(target);
			});
		});
	}else{
		compressFile(target);
	}
};

// 代码压缩
function compressFile(target){
	fs.readFile(target, function(err, data){
		if(err){
			console.log("压缩文件读取失败:" + target);
		}else{
			if(/\.js$/.test(target)){
				// 使用uglifyJS压缩
				
				var result = UglifyJS.minify([target]);
				fs.writeFile(target, result.code, function(err, data){
					if(err){
						console.log("压缩失败..");
					}else{
						console.log("压缩成功..");
					}
				});
				
				// 使用yui压缩	
				/*		
				yuicompressor.compress(target, {
					//Compressor Options:
					charset: 'utf8',
					type: 'js',
					nomunge: false
				}, function(err, data, extra) {
					//err   If compressor encounters an error, it's stderr will be here
					//data  The compressed string, you write it out where you want it
					//extra The stderr (warnings are printed here in case you want to echo them
					if(err){
						console.log("YUI压缩失败..");
					}else{
						fs.writeFile(target, data, function(err){
							if(err){
								console.log("写入失败..");
							}else{
								console.log("压缩成功..");
							}
						});
					}
				});
				*/
			}
			/* 这是压缩html代码的...，html代码中的脚本，会通过uglify.js压缩
			fs.writeFile(target, minify(data.toString(), {
				removeComments: true,
				collapseWhitespace: true,
				minifyJS:true
			}), function(err, data){
				if(err){
					console.log("压缩失败..");
				}else{
					console.log("压缩成功..");
				}
			});
			*/
		}
	});
}

