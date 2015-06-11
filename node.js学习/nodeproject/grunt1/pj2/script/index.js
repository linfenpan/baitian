function A(name){
	this.name = name;
};
A.prototype = {
	say: function(){
		console.log(this.name);
	}
};