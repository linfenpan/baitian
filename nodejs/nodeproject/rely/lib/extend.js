// 类型检查
var protoToString = Object.prototype.toString;
function type(obj){
	var res = protoToString.call(obj).slice(1, -1);
	return res.split(" ")[1].toLowerCase();
}
// 对象拓展
// @param obj1 将会被覆盖的对象
// @param obj2 
function extend(obj1, obj2){
	for(var i in obj2){
		if(obj2.hasOwnProperty(i)){
			var item = obj2[i];
			switch(type(item)){
				case "array":
					if(type(obj1[i]) !== "array"){
						obj1[i] = [];
					}
					extend(obj1[i], item);
					break;
				case "object":
					if(type(obj1[i]) !== "array"){
						obj1[i] = {};
					}
					extend(obj1[i], item);
					break;
				default:
				obj1[i] = item;	
			}
		} // 在原型对象的，就忽略吧，数组的hasOwnProperty很有趣哦
	}
	return obj1;
};
module.exports = {
	type: type, 
	extend: extend
};