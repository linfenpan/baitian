//module.js
var name;
exports.setName = function(thyName){
	name = thyName;
}
exports.sayHi = function(){
	console.log("hello " + name);
}