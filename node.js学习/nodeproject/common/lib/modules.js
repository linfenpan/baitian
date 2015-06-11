/**
 * 配置读取
 * @description 一些常用工具
 * @author da宗熊
 * @email 384858402@qq.com
 */

var fs = require("fs"), path = require("path");
var findAll = require("./findAll"), $ = require("./tool");
var mod = fs.readFileSync("./modules.json", {encoding: "utf8"});
var access = require("./access");


mod = JSON.parse(mod);
var proto = {
	pkg: mod,
	cwd: path.normalize(mod.cwd.replace(/[\/\\]$/, "")), // 把最后的斜杆干掉
	js: function(list){
		return this.find("*.js", list);
	},
	css: function(list){
		return this.find("*.css", list);
	},
	image: function(list){
		return this.find("*.{png,jpg,gif,jpeg}", list, true);
	},
	exist: function(p){
		return $.isExist(path.join(this.cwd, p));
	},
	/**
	 * 寻找制定板块的代码
	 * @param sufix {String} 后缀
	 * @param list {Array} 遍历列表
	 * @param isAll {Boolean} 是否查找子目录
	 * @return {Array} 结果列表
	 */
	find: function(sufix, list, isAll){
		var res = [];
		if($.type(list) !== "array"){
			list = [list];
		};
		
		list.forEach(function(m, index){
			var pattern = [this.cwd, path.normalize(m)];
			if(isAll){
				pattern.push.call(pattern, "**", sufix);
			}else{
				pattern.push(sufix);
			}
			pattern = pattern.join(path.sep);
			
			$.log(pattern);
			
			res.push.apply(res, findAll(pattern));
		}.bind(this));
		return res;
	},
	// 读取module的配置文件
	readPkg: function(pkg){
		try{
			var txt = access.read(path.join(this.cwd, path.join(pkg, pkg + ".json")));
			return JSON.parse(txt);
		}catch(e){
			return {};
		}
	}
};

 

var modules = module.exports = Object.create(proto);


