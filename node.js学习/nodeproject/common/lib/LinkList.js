/**
 * 双向链表
 * @description 简易插入、寻找的双向链表，当然，你也可以当作是单向链表使用
 * @author da宗熊
 * @email 384858402@qq.com
 * @example:
 *			var link1 = new LinkList(123);
 *			取值: link1.val();			设值: link1.val(222);
 *			前插: link1.prepend(22);	后插: link1.append(33);
 *			查看当前所有数据: link1.overview(true?); true则从后开始看，返回[]
 *			链头: link1.header();		链尾: link1.footer();
 *			查找: link1.find(22);
 *			往前找: link.findPrev(22);	往后找: link1.findNext(22);
 *	@other
 *		自己事先维护一个header和footer对象，就可以很方便的在 最前面 和 最后面 插值
 */
var LinkList = function(data){
	this.prev = null;
	this.data = data;
	this.next = null;
};
LinkList.prototype = {
	val: function(data){
		if(data){
			this.data = data;
		}else{
			return this.data;
		}
	},
	prepend: function(node){
		if(!(node instanceof LinkList)){
			node = new LinkList(node);
		}
		
		var prev = this.prev;
		this.prev = node;
		node.next = this;
		
		if(prev instanceof LinkList){
			node.prev = prev;
			prev.next = node;
		}
		// console.log(this);
	},
	append: function(node){
		if(!(node instanceof LinkList)){
			node = new LinkList(node);
		}
		var next = this.next;
		this.next = node;
		node.prev = this;
		
		if(next instanceof LinkList){
			next.prev = node;
			node.next = next;
		}
	},
	// 查看，从头[尾]开始看..
	overview: function(isFromFooter){
		var header, fn;
		if(isFromFooter){
			header = this.footer();
			fn = "prev";
		}else{
			header = this.header();
			fn = "next";
		};
		
		var res = [header.data], node = header[fn];
		while(node instanceof LinkList){
			res.push(node.data);
			node = node[fn];
		}
		return res;
	},
	// 表头
	header: function(){
		var prev = this.prev, node = this;
		while(prev instanceof LinkList){
			node = prev;
			prev = node.prev;
		}
		return node;
	},
	// 表尾
	footer: function(){
		var next = this.next, node = this;
		while(next instanceof LinkList){
			node = next;
			next = node.next;
		}
		return node;
	},
	// 修正查找数据
	_fixFindData: function(data){
		if(data instanceof LinkList){
			data = data.data;
		}
		return data;
	},
	// 往前查找，找到，返回那个节点，找不到，返回null
	findPrev: function(data){
		data = this._fixFindData(data);
		var prev = this.prev;
		while(prev && prev.data !== data){
			prev = prev.prev;
		};
		return prev;
	},
	// 往后查找，找到，返回那个节点，找不到，返回null
	findNext: function(data){
		data = this._fixFindData(data);
		var next = this.next;
		while(next && next.data !== data){
			next = next.next;
		};
		return next;
	},
	// 查找，先找前面，在找后面
	find: function(data){
		var node = this.findPrev(data);
		if(!node){
			node = this.findNext(data);
		}
		return node;
	}
};

module.exports = LinkList;