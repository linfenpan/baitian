/**
 * 工具库
 * @description 一些常用工具
 * @author da宗熊
 * @email 384858402@qq.com
 */

var fs = require("fs");
var o2str = Object.prototype.toString;

var proto = {
	extend: function(source){
		var res, isDeep = false/*是否深复制*/;
		// 1) 修正对象
		if(source === true){
			res = {};
			isDeep = true;
		}else if(typeof source === "object"){
			res = source;
		}else{
			throw "extend的参数，需要是个对象~";
		}
		
		// 2)遍历合并
		var args = [].slice.call(arguments, 1);
		args.forEach(function(obj, index){
			if(typeof obj === "object"){
				this._cloneObj(res, obj, isDeep);
			}else{
				throw "只能复制对象，请检查数据类型：" + index;
			}
		}.bind(this));
		
		return res;
	},
	// 复制对象
	_cloneObj: function(res, obj, isDeep){
		var item;
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				item = obj[i];
				if(item === obj && isDeep){
					// 因为深复制，会无限循环，但是浅复制不会~
					throw "对象引用了自己，无法复制...";
				}else if(typeof item === "object"){
					// 深赋值，则一路往下遍历
					if(isDeep){
						if(this.type(item) === "array"){
							res[i] = [];
						}else{
							res[i] = {};
						}
						this._cloneObj(res[i], item, isDeep);
					}else{
						res[i] = item;
					}
				}else{
					res[i] = item;
					
				}
			}
		}
	},
	// 类型
	type: function(obj){
		var res = /([^ ]+)]$/.exec(o2str.call(obj));
		return res ? res[1].toLowerCase() : null;
	},
	// 是否文件目录
	isDir: function(p){
		if(fs.existsSync(p)){
			var stat = fs.statSync(p);
			return stat.isDirectory();
		}else{
			return false;
		}
	},
	// 文件是否存在
	isExist: function(p){
		return fs.existsSync(p);
	},
	// 打印日志
	log: function(){
		console.log.apply(console, arguments);
	}
};
 

var tool = module.exports = Object.create(proto);


