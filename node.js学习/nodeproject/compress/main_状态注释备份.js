var fs = require("fs");
var util = require("util");
// 压缩脚本，压缩脚本比较好
var uglifyJS = require("uglify-js");
// YUI的压缩器，脚本压缩木有uglify厉害
var yuicompressor = require('yuicompressor');


fs.readFile('config.json', function(err, data){
	if(err){
		console.error(err);
	}else{
		// 配置支持对象和列表模式
		// 配置项如下: {"target":"目标文件名", "relative": "相对目录", "files": [文件列表]}
		// target 要带有.js或.css后缀, files没有数据，则遍历root整个目录
		// target 不存在，则遍历root目录
		var json = JSON.parse(data.toString());
		
		if(json.length > 0){
			for(var i in json){
				fileCompressor.addTask(json[i]);
			}
		}else{
			fileCompressor.addTask(json);
		}
		fileCompressor.start();
	}
});

/*
fs.stat('xx.txt', function (err, stats) {
  if (err) throw err;
  console.log('stats: ' + JSON.stringify(stats));
  // A: mode 33206 插入
  // RA: mode 33060 只读、插入
});
*/

var fileCompressor = {
	task: [],
	addTask: function(item){
		this.task.push(item);
	},
	start: function(){
		var item = this.task.shift(), that = this;
		if(item){
			var target = item.target, relative = item.root || "";
			if(/\.js$/.test(target)){
				// 如果是脚本，使用uglify-js压缩
				this.expainRelative(relative, item.files, function(list){
					if(list && list.length > 0){
						console.log(list);
						that.uglifyCompress(target, list, target);
					};
					// 继续下一个任务
					that.start();
				}, "js");
			}else if(/\.css$/.test(target)){
				// 如果是样式，使用yui压缩
				this.expainRelative(relative, item.files, function(list){
					if(list && list.length > 0){
						console.log(list);
						// 合并文件
						that.combineFiles(target, list, function(){
							// 通过YUI压缩
							that.yuiCompress(target, "css", target);
						});
					};
					// 继续下一个任务
					that.start();
				}, "css");
			}else if(!target){
				// target不存在，对每一个文件进行压缩
				this.expainRelative(relative, item.files, function(list){
					that.compressEveryFile(list);
					// 继续下一个任务
					that.start();
				}, "*");
			}else if(target){
				var arr = target.split("/");
				var lastString = arr[arr.length - 1];
				// target存在，且不是脚本、样式，而是文件夹..
				if(/[^.]*$/.test(lastString)){
					// console.log("文件夹:" + lastString);
					// 把压缩后的文件，全部扔在新的文件夹里
					this.expainRelative(relative, item.files, function(list){
						// 压缩列表、对目录进行包装
						that.compressEveryFile(list, target);
						// 继续下一个任务
						that.start();
					}, "*");
				}
				
			}
		}
	},
	// 重设文件的状态
	resetFileAttr: function(file, cb){
		// 33206 是 A 状态
		fs.chmod(file, 33206, function(){
			cb && cb();
		});
	},
	// 解析路径
	expainRelative: function(relative, list, cb, type){
		var res = [], type = type || "js";
		if(relative){
			if(list){
				for(var i in list){
					res.push(relative + list[i]);
				}
				cb && cb(res);
			}else{
				// 路径存在，读取文件夹，解析路径
				// 暂时只支持单层解析
				fs.readdir(relative, function(err, files){
					for(var i in files){
						var file = files[i];
						if(type == "*" || (type == "css" && /\.css$/.test(file))){
							res.push(relative + file);
						}else if(type == "*" || (type == "js" && /\.js/.test(file))){
							res.push(relative + file);
						}
					}
					cb && cb(res);
				});
			}
		}else if(list){
			res = list.slice(0);
			cb && cb(res);
		}else{
			res = null;
			cb && cb(res);
		}
	},
	// 写入文件
	writeFile: function(fileName, code, cb){
		// 如果有目录配置，先创建目录
		if(fileName.indexOf("/") >= 0){
			this.mkdirSync(fileName.slice(0, fileName.lastIndexOf("/")));
		};
		// 写入文件
		fs.writeFile(fileName, code, function(err, data){
			if(err){
				console.log("压缩失败:" + fileName);
			}else{
				console.log("压缩成功:" + fileName);
			}
			cb && cb();
		});
	},
	// 建立目录
	mkdirSync: function(path){
		// console.log("目录:" + path);
		var stack = [], list = path.split("/");
		for(var i = 0, max = list.length; i < max; i++){
			stack.push(list[i]);
			if(i >= 1){
				var path = stack.join("/");
				if(!fs.existsSync(path)){
					fs.mkdirSync(path);
				}
			}
		}
	},
	// 合并文件
	combineFiles: function(name, list, cb){
		fs.unlink(name, function(err){
			if(err){
				console.log("文件删除失败");
			}
			// 不管删除成功否.
			var files = list;
			(function readNextFile(){
				var item = files.shift(), func = arguments.callee;
				if(item){
					fs.readFile(item, function(err, data){
						fs.appendFile(name, data + '\n', function(err){
							func();
						});
					});
				}else{
					cb && cb();
				}
			}());
			//////
		});
	},
	// 压缩每个文件
	// newPath是新路径
	compressEveryFile: function(list, newPath){
		var that = this;
		if(list && list.length > 0){
			// 自运行项目...
			(function(){
				var item = list.shift(), func = arguments.callee;
				var newItem = item;
				if(newPath && item){
					if(!/\/$/.test(newPath)){
						newPath += "/";
					}
					var str = item.split("/"), str = str[str.length - 1];
					newItem = newPath + str;
				};
				if(/\.js$/.test(item)){
					// 通过uglify.js压缩
					var result = uglifyJS.minify(item);
					that.uglifyCompress(item, item, newItem, func);
				}else if(/\.css$/.test(item)){
					// 通过YUI压缩
					that.yuiCompress(item, "css", newItem, func);
				};
			}());
			//////
		};
	},
	// uglify压缩
	uglifyCompress: function(target, list, autoWrite, cb){
		var that = this;
		// 通过uglify.js压缩
		var result = uglifyJS.minify(list);
		// 更改文件只读状态
		if(autoWrite){
			that.resetFileAttr(target, function(){
				that.writeFile(typeof autoWrite == "string" ? autoWrite : target, result.code, cb);
			});
		}else{
			cb && cb();
		}
	},
	// yui压缩
	yuiCompress: function(target, type, autoWrite, cb){
		var that = this;
		yuicompressor.compress(target, {
			charset: 'utf8',
			type: type,
			nomunge: false
		}, function(err, data, extra) {
			//err   If compressor encounters an error, it's stderr will be here
			//data  The compressed string, you write it out where you want it
			//extra The stderr (warnings are printed here in case you want to echo them
			if(err){
				console.log("YUI压缩失败..");
			};
			if(autoWrite){
				// 更改文件只读状态
				that.resetFileAttr(target, function(){
					that.writeFile(typeof autoWrite == "string" ? autoWrite : target, data, cb);
				});
			}else{
				cb && cb();
			}
			
		});
	}
};

