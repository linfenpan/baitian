/**
 * 编译成功后，需要打包
 * @author da宗熊
 * @email 384858402@qq.com
 */

var packup = {
	/**
	 * 打包文件
	 * @param options {Object} 打包信息 {dest: 目标文件夹, js: compress, css: [compress, fix], other: copy}
	 * @param obj {Object} 编译过后的对象 [{module: aa, list: []}]
	 */
	pack: function(options, obj){
		
	},
	proxy: function(){
		var p = Object.create(this);
		
		return p;
	}
};



module.exports = packup.proxy();