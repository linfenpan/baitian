// 文件编译
var path = require("path"),
	opera = require("./fileOperation"), 
	extend = require("./extend").extend,
	type = require("./extend").type;
var cpl = module.exports = {};

/** 编译文件，给相关的脚本、样式、图片，添加版本号
 * @param file {String} 文件路径
 * @param code {String|Function} 需要添加的版本号，如果没有，则采用当前时间
 * @return {text:{String}, list:{Array}};
 */
cpl.compile = function(file, options){
	// 修正参数
	var options = extend({
		code: null, // 版本号
		js: true,	// 编译脚本
		css: true,  // 编译样式
		img: true,   // 编译图片
		path: "./"   // 目标目录
	}, options);
	
	// 如果code是function，那么呵呵~
	var tCode = options.code, code = Math.round(new Date()/100);
	tCode = type(tCode) === "function" ? tCode : function(){return "_" + code++};
	
	// 读取文件
	var data = opera.read(file),
		fixList = [], res;
	if(!data){
		console.log("文件是空的:" + file);
		return null;
	};
	// 为了更好理解，这个循环，看下面注释部分理解吧~
	for(var i in {js:1, css:1, img:1}){
		if(options[i]){
			res = this["fix" + i.toUpperCase()](data, tCode, options.path || "./");
			data = res.text, fixList = fixList.concat(res.list);
		}
	}
	
	// 脚本
	/*
	if(options.js){
		res = this.fixJS(data, tCode);
		data = res.text, fixList = fixList.concat(res.list);
	}
	
	// 样式
	if(options.css){
		res = this.fixCSS(data, tCode);
		data = res.text, fixList = fixList.concat(res.list);
	}
	
	// 图片
	if(options.img){
		res = this.fixIMG(data, tCode);
		data = res.text, fixList = fixList.concat(res.list);
	}*/
	
	return {
		text: data,
		list: fixList
	};
};

/** 基础的三个编译函数
 * @param html {String} 需要编译的html
 * @param code {function} 需要添加的code
 * @return {text:{String}, list:{Array}}
 */
cpl.fixJS = fixJS;
cpl.fixCSS = fixCSS;
cpl.fixIMG = fixIMG;
function fixJS(html, code, p){
	var files = [];
	return {
		text: html.replace(/(<script.*src\s*=\s*["|'])([^"']*)(\.js[^"']*)(["|'].*>\n*\s*<\/script>)/gmi, function(str, prefix, src, js, subfix){
			var obj = {old: src + js};
			if(code){
				src += code();
				if(p){
					src = path.join(p, src);
				}
			}
			obj["new"] = src + js;
			files.push(obj);
			return prefix + src + subfix;
		}),
		list: files
	}
};
function fixCSS(html, code, p){
	var files = [];
	return {
		text: html.replace(/(<link.*href\s*=\s*["|'])([^"']*)(\.css[^"']*)(["|'].*\/?>)/gmi, function(str, prefix, href, css, subfix){
			var obj = {old: href + css};
			if(code){
				href += code();
				if(p){
					href = path.join(p, href);
				}
			}
			obj["new"] = href + css;
			files.push(obj);
			return [prefix, href, css, subfix].join("");
		}),
		list: files
	}
};
function fixIMG(html, code, p){
	var files = [];
	return {
		text: html.replace(/(<img.*src\s*=\s*["|'])([^"']*)(["|'].*\/?>)/gmi, function(str, prefix, src, subfix){
			var obj = {old: src};
			if(code){
				src = src.replace(/\.(?=[png|jpg|gif|jpeg])/gmi, code() + ".");
				if(p){
					src = path.join(p, src);
				}
			}
			obj["new"] = src;
			files.push(obj);
			return [prefix, src, subfix].join("");
		}),
		list: files
	}
};

