//getmodule.js
var mymodule = require("./module");
mymodule.setName("bye node~");

var mymodule1 = require("./module");
mymodule1.setName("bye again");

//����������һ���ģ�֤����requireָ����ͬһ��ʵ�� "hellow bye again"
mymodule.sayHi();
mymodule1.sayHi();