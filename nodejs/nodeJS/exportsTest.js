//exportsTest.js
function hello(){
	var name;
	this.setName = function(tName){
		name = tName;
	}
	this.sayHi = function(){
		console.log("hello " + name);
	}
}

//通过module.exports,把用于暴露到外面的exports改写
module.exports = hello;
//上面这东西，跟exports的作用不一样，
//如果，用exports.hello = hello，外层调用，就得这样: require('./exportsTest').hello
//如果，用exports = hello，你会发现，外层的require('./exportsTest')会没有内容
//但是，如果用module.exports = hello，外层调用，就简单多了var hello = require('./exportsTest');