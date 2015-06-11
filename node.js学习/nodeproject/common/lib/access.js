/**
 * 读、存器
 * @description 快速存储、读取数据，默认编码utf8
 * @author da宗熊
 * @email 384858402@qq.com
 * @bug 只支持相对路径的度写，如果愣是想操作绝对路径，请设置setDir(绝对路径)，然后再以相对路径操作
 */

var fs = require("fs"), path = require("path");
var $ = require("./tool");	// 覆盖默认的util库?，还是用tool吧

var proto = {
	_encoding: "utf8",
	_dir: "./",
	// 设置操作目录
	setDir: function(d){
		this._dir = d;
	},
	// 真正操作的路径
	_path: function(p){
		return path.join(this._dir, p);
	},
	// 设置编码
	setEncode: function(ed){
		this._encoding = ed;
	},
	/**
	 * 读取文件
	 * @param n {String} 文件名
	 * @return {String}
	 */
	read: function(n){
		// 1) 文件存在不？
		if(this.exist(n)){
			return fs.readFileSync(this._path(n), {
				encoding: this._encoding
			});
		}else{
			throw "文件不存在";
		}
	},
	/**
	 * 写入文件
	 * @param p {String} 写入路径
	 * @param txt {String} 写入内容
	 */
	write: function(p, txt){
		// 1) 生成路径，最后一位，是文件名
		var fullPath = this.splitPath(p);
		fullPath.pop();
		fullPath = fullPath.join(path.sep);
		this.createFolder(fullPath);
		
		// 2) 写入文件
		fs.writeFileSync(this._path(p), txt, {
			encoding: this._encoding
		});
		
		return true;
	},
	/**
	 * 合并文件
	 * @param p {String} 文件新的路径
	 * @param list [Array] 操作文件列表
	 * @param options {Object?} 合并参数 {seq: 分割符,默认是';'}
	 */
	combine: function(p, list, options){
		var options = $.extend({seq: "\n;\n"}, options || {});
		var arr = [];
		list.forEach(function(v, i){
			arr.push(this.read(v));
		}.bind(this));
		var text = arr.join(options.seq);
		
		this.write(p, text);
	},
	// 是否存在某个文件
	exist: function(p){
		return fs.existsSync(p);
	},
	// 分割文件路径
	splitPath: function(p){
		return p.split(/\/|\\/);
	},
	// 创建文件夹
	createFolder: function(p){
		// 1)规范目录 2)便利生成目录
		p = path.normalize(p);
		
		$.log("创建目录:" + p);
		
		var list = this.splitPath(p), arr = [];
		list.forEach(function(v, i){
			// 这里的this对象，如果不经过bind，就被改写的说~
			arr.push(v);
			this._createOneFolder(arr.join(path.sep));
		}.bind(this));
	},
	// 创建一个文件夹
	_createOneFolder: function(p){
		p = this._path(p);
		if(!this.exist(p)){
			fs.mkdirSync(p);
		}
	},
	// 代理，用于处理新的相对地址【或一些诡异的事情】
	proxy: function(dir){
		var pr = Object.create(this);
		pr._dir = dir || "./";
		pr._encoding = "utf8";
		return pr;
	}
}


var access = module.exports = proto.proxy();



