//getmodule.js
var mymodule = require("./module");
mymodule.setName("bye node~");

var mymodule1 = require("./module");
mymodule1.setName("bye again");

//发现两个是一样的，证明，require指向了同一个实例 "hellow bye again"
mymodule.sayHi();
mymodule1.sayHi();