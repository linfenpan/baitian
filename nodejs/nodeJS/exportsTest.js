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

//ͨ��module.exports,�����ڱ�¶�������exports��д
module.exports = hello;
//�����ⶫ������exports�����ò�һ����
//�������exports.hello = hello�������ã��͵�����: require('./exportsTest').hello
//�������exports = hello����ᷢ�֣�����require('./exportsTest')��û������
//���ǣ������module.exports = hello�������ã��ͼ򵥶���var hello = require('./exportsTest');