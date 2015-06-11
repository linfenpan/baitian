/**
 * 寻找搜索符合条件的文件
 * @author da宗熊
 * @email 384858402@qq.com
 */

var minimatch = require('minimatch'), fs = require("fs"), path = require("path");
var $ = require("./tool");

var defauntOption = {
	cwd: "./"
}; 

// 寻找所有路径
function findAll(pattern, options){
	var options = $.extend({}, defauntOption, options || {});
	var _path = path.normalize(options.cwd);
	if($.isExist(_path)){
		return findOnePath(_path, pattern);
	}else{
		return [];
	}
};

function findOnePath(_path, pattern){
	// console.log(_path, pattern);
	var list = fs.readdirSync(_path), res = [];
	list.forEach(function(p, index){
		p = path.join(_path, p);
		
		if($.isExist(p)){
			if($.isDir(p)){
				// 是目录，继续遍历
				res.push.apply(res, findOnePath(p, pattern));
			}else if(minimatch(p, pattern, {matchBase: true})){
				// 不是目录，压入队列
				res.push(p);
				$.log("压入:" + p);
			}
		}
	});
	return res;
};


module.exports = findAll;

