define(function(require, exports, module){
	var UC = require("./user"), $ = require("jquery");
	var ddWeixin = require("ddWeixin");
	
	if(ddWeixin && ddWeixin.isWeixin){
		UC._checkLogin = UC.checkLogin;
		ddWeixin.done(function(openId){
			UC.checkLogin = function(){
				// 燕平需要改为code查询的
				$.get("/uc/loginFromWx.json", {
					openId: openId
				}, function (data) {
					// 有正确数据返回...
					if (data && data.res) {
						var res = data.res;
						if (res.code >= 0) {
							UC._checkLogin();
						}
					}
				}, "json");
				return this;
			};
		});
		
	}
	
	module.exports = UC;
});