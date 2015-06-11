var events = require("events");
var util = require("util");
function Factory(cnf){
	// 集成node.js的event方法
	events.EventEmitter.call(this);
	// 传入配置
	this.config = cnf || {};
};
module.exports = Factory;

// 配置列表
var keyMap = {
	regA: {
		key: ["before", "prepend"], // 注意咯，列表大于3，就不知道会产生什么bug了
		q: { // 简单的快捷键, 如: head-p等于head-prepend
			"p": "prepend",
			"bf": "before"
		}
	},
	regP: {
		key: ["append", "after"],
		q: {
			"a": "append",
			"af": "after"
		}
	},
	reg: {
		key: ["replace"],
		q: {
			"r": "replace"
		}
	}
};
var _proto_ = {
	// 占位符
	__: "$$##"
	// 默认分隔符，生成最终内容的时候，采用的符号
	,_split: '\n'
	// 初始化模版
	// @param text 需要更替的文字
	,initHtmlWithCnf: function(text){
		var newTxt = text, cnf = this.config;
		for(var i in cnf){
			var c = cnf[i], key = this.__ + i;
			// 根据keyMap生成占位规则
			for(var j in keyMap){
				// 如: c.regA存在
				if(c[j]){
					// 拿到配置项，如: keyMap.regA
					// 根据keyMap的值，生成占位规则
					// 每个keyMap[item].key，生成"$$##head-append"这样子的占位规则
					// 如果key.length >= 2，则生成"$$##head-append</head>$$##head-after"这样子的占位规则
					var item = keyMap[j];
					// 替换正则
					newTxt = newTxt.replace(c[j], function(a){
						var arr = [], max = Math.min(2, item.key.length);
						for(var m = 0; m < max; m++){
							arr.push(key + "-" + item.key[m]);
						}
						return arr.join("\n" + a + "\n");
					});
				}
			};
		};
		// 模版内容和规则，都重新设置
		this.text = newTxt;
		this.rules = {};
	}
	// 需有模版内容，才能使用pushData
	// @param rule 插入规则，rule形式如下： key-operation, 如: head-append,head-prepend
	// @param text 插入文字
	,pushData: function(rule, text){
		if(!this.text || !this.rules)return;
		// 在this.rules中，加入需要替换的文字
		if(rule){
			// 兼容一个简化的规则
			var arr = rule.split(/-|:/);
			if(arr.length > 1){
				for(var i in keyMap){
					// 快捷键列表
					var item = keyMap[i].q;
					if(item && item[arr[1]]){
						var key = arr[1], value = item[arr[1]];
						rule = rule.replace(
							new RegExp("-" + key + "$", "g"), "-" + value);
					}
				}
			}
			// 插入数据列表
			if(!this.rules[rule]){
				this.rules[rule] = [];
			}
			this.rules[rule].push(text || "");
		}else{
			console.log("pushData error, check rule and text content", rule, text);
		}
	}
	// 最终生成内容
	// 发布4个事件:
	//	key:append，append插入内容时
	//  key:prepend，prepend插入内容时
	//  key:replace，replace替换内容时
	//  key，内容插入完毕
	,generateFile: function(){
		var cnf = this.config;
		for(var i in cnf){
			var c = cnf[i];
			for(var j in keyMap){
				// 如果config.regA存在的话
				if(c[j]){
					var list = keyMap[j].key;
					for(var m in list){
						// 遍历key列表
						var key = i + "-" + list[m];
						// 把 head-append这类的玩意，替换掉
						this._replaceTextWithKey(key);
						// 发布类似"head:append"这样的事件
						this.emit(i + ":" + list[m]);
					}
				}
			}
			// 发布总的处理事件
			this.emit(i);
		}
		return this.text;
	}
	// 根据key，替换this.text内容
	,_replaceTextWithKey: function(key){
		var text = this.text;
		if(this.rules[key]){
			text = text.replace(this.__ + key, this.rules[key].join(this._split));
		}else{
			text = text.replace(this.__ + key, "");
		}
		this.text = text;
	}
};

// 继承events.EventEmitter;, Factory.prototype被重设为{}
util.inherits(Factory, events.EventEmitter);

// 需要手动重写原型链
for(var i in _proto_){
	Factory.prototype[i] = _proto_[i];
}

