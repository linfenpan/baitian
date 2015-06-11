var fs = require("fs");
var path = require("path");

// 压缩脚本，压缩脚本比较好
/*
var uglifyJS = require("uglify-js");
// YUI的压缩器，脚本压缩木有uglify厉害
var yuicompressor = require('yuicompressor');
*/

// uglify压缩
// uglifyJS.minify([])

// yui压缩
/*
	yuicompressor.compress(target, {
		charset: 'utf8',
		type: "js" | "css",
		nomunge: false
	}, function(err, data, extra) {});
*/

// 当前目录
var dirPath = process.cwd();
var infix = ".min";

// 参数列表，前面两个参数无用
// -j 只压缩脚本
// -c 只要锁样式
var param = process.argv.slice(2);
!function(){
	var obj = {};
	for(var i in param){
		var n = param[i];
		if(n.indexOf('-') == 0){
			obj[n.replace(/-/g, "")] = !0;
		}else{
			// 如果木有"-"的，就是要处理的文件名
			obj["fileName"] = n;
		}
	};
	param = obj;
}(process, param);
// console.log(JSON.stringify(param));



// 压缩器
var Compressor = function(){
	this.uglify = require("uglify-js");
	this.yui = require("yuicompressor");
};
Compressor.prototype = {
	// 压缩样式
	css: function(myPath, name){
		if(!this.exists(myPath, name)){
			return;
		}
		var fullPath = path.join(myPath, name), context = this;
		context.yui.compress(fullPath, {
			charset: "utf8",
			type: "js"
		}, function(err, data, extra){
			var fn = "suc";
			if(err){
				fn = "err";
			}else{
				fullPath = context.newPath(myPath, name, ".css")
				fs.writeFileSync(fullPath, data);
			}
			context[fn](fullPath, "css");
		});
	},
	// 压缩脚本
	js: function(myPath, name){
		if(!this.exists(myPath, name)){
			return;
		}
		var fullPath = path.join(myPath, name), ctx = this;
		var data = this.uglify.minify(fullPath, {
			// 压缩参数
			mangle: {
				// 不压缩下面的变量
				except: ["require", "module", "exports"],
				// 是否压缩顶层的变量名字
				toplevel: false
			}
		});
		fullPath = this.newPath(myPath, name, ".js");
		fs.writeFileSync(fullPath, data.code);
		ctx.suc(fullPath, ".js");
	},
	err: function(fullPath, type){
		console.log("Error:" + fullPath);
	},
	suc: function(fullPath, type){
		console.log("Sucess:" + fullPath);
	},
	exists: function(myPath, name){
		var fp = path.join(myPath, name);
		if(fs.existsSync(fp)){
			return true;
		}else{
			this.err(fp);
			return false;
		}
	},
	newPath: function(myPath, name, sufix){
		var baseName = path.basename(name, sufix);
		return path.join(myPath, baseName + infix + sufix);
	},
	auto: function(myPath, name){
		var ext = path.extname(name).toLowerCase(), fn = "js";
		if(ext == ".css"){
			fn = "css";
		}
		this[fn](myPath, name);
	}
};

var cp = new Compressor();
// cp.auto("./", "test.js");
// cp.js("./", "test.js");
// 遍历整个目录
function compressAll(type){
	console.log("************** 编译中 **************");
	
	var list = fs.readdirSync(dirPath);
	for(var i in list){
		var name = list[i],
			file = path.join(dirPath, name),
			filePath = path.dirname(file),
			ext = path.extname(file).toLowerCase();
		if(fs.lstatSync(file).isFile() && !/\.min/.test(name)){
			// 编译文件
			if(type && ext === type){
				// 有指定类型的，就编译相关类型
				cp.auto(filePath, name);
			}else if(ext === ".js" || ext === ".css"){
				cp.auto(filePath, name);
			}
		}
	}	
}

var operationMap = {
	j: ".js",
	c: ".css"
}, isDealWith = false;
for(var i in param){
	var item = operationMap[i];
	if(item && item !== "fileName"){
		if(param.fileName){
			cp[item.slice(1)](dirPath, param.fileName);
		}else{
			compressAll(item);	
		}
		isDealWith = true;
		break;
	};
	
};
// 如果没有处理，则进行整个文件夹处理
if(!isDealWith){
	if(param.fileName){
		cp.auto(dirPath, param.fileName);
	}else{
		compressAll();
	}
}
