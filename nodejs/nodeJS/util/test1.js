var util = require('util');

var Person = function(){
	this.name = "a", this.age = 10;
	this.sayHi = function(){
		console.log("hi");
	};
	this.toString = function(){
		return this.name + ":" + this.age;
	};
}

var obj = new Person();

console.log(util.inspect(obj));
console.log(util.inspect(obj, true));