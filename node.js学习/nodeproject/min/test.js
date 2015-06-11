require("fs");

var Mechine = function(){
	if(this instanceof Mechine){
		var arg = arguments;
		// 修正非new模式初始化的参数
		if(arg[0] && typeof arg[0].length == "number"){
			arg = arg[0];
		}
		this.init.apply(this, arg);
		return this;
	}else{
		return new Mechine(arguments);
	}
};
/**
	注释吗？
*/
Mechine.prototype = {
	init: function(name, options){
		this.name = name || "da棕熊";
		this.options = options || {};
	}
	,caculate: function(){
		var res = 0;
		for(var i in this.name){
			var ch = this.name[i].charCodeAt(0);
			res += ch;
		}
		return res;
	}
};

definde(function(require, exports, module){
	var $ = require("jquery"), $e = $("body");
	module.exports = {
		author: "da宗熊",
		email : "1071093121@qq.com",
		$root : $e
	};
});