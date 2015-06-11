var path = require("path"), fs = require("fs");
var op = module.exports = {};
/** 批量创建目录
 * @param dst {String} 需要创建的目录
 */
op.mkdir = function(dst){
	var dst = dst.split(/\/|\\/);
	if(dst){
		var arr = [];
		dst.forEach(function(p){
			// 遍历路径咧~
			arr.push(p);
			var ph = path.join.apply(path, arr);
			if(fs.existsSync(ph)){
				// 目录存在，什么都不做
			}else{
				fs.mkdirSync(ph);
			}
		});
	}
};

/** 复制文件
 * @param src {String} 源目录
 * @param dst {String} 目标目录
 */
op.copy = function(src, dst){
	try{
		var paths = fs.readdirSync(src);
		if(!fs.existsSync(dst)){
			fs.mkdirSync(dst);
		};
		
		paths.forEach(function(p){
			// 遍历目录
			var _src = path.join(src, p), 
				_dst = path.join(dst, p),
				stat = fs.statSync(_src);
			
			if(stat.isFile()){
				var readStream = fs.createReadStream(_src),
					writeStream = fs.createWriteStream(_dst);
				readStream.pipe(writeStream);
			}else if(stat.isDirectory()){
				// 是目录，就创建~
				this.copy(_src, _dst);
			}
		});
	}catch(e){
		throw e;
	}
};
/** 以utf-8形式，读取文件
 * @param fp {String} 文件路径
 */
op.read = function(fp){
	if(fs.existsSync(fp)){
		if(fs.statSync(fp).isFile()){
			return fs.readFileSync(fp, {
				encoding: "utf8"
			});
		}else{
			return null;
		}
	}else{
		return null;
	};
	
};
/** 以utf-8格式，写入文件
 * 写入文件
 */
op.write = function(fp, txt){
	try{
		// 更新文件的只读状态
		if(fs.existsSync(fp)){
			fs.chmodSync(fp, 33206);
		}
		// 写入文件
		fs.writeFileSync(fp, txt, {
			encoding: "utf8"
		});
		console.log("写入:" + fp);
		return true;
	}catch(e){
		throw e;
		return false;
	}
};
