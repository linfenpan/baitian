define(function(n,e,o){var c=n("script/user.js"),i=n("jquery"),r=n("ddWeixin");c._checkLogin=c.checkLogin,r.done(function(n){c.checkLogin=function(){return i.get("/uc/loginFromWx.json",{openId:n},function(n){if(n&&n.res){var e=n.res;e.code>=0&&c._checkLogin()}},"json"),this}}),o.exports=c});