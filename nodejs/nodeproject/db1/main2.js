var http = require("http");

var server = new http.Server();
server.on("request", function(req, res){res.end(null);});
server.listen(3000, function(){
	console.log("port 3000 is listening...");
});


// 插入测试
var MongoClient = require("mongodb").MongoClient;
var util = require("util");

// 链接url
var url = "mongodb://localhost:27017/myproject2";
// 使用connect方法，链接到数据库服务器
MongoClient.connect(url, function(err, db){
	if(err){
		console.log("connect error");
	}else{
		console.log("Connected correcty to server");
		
		// 也可以插入数组，collection只是一个合集，类似于表名
		var tb1 = db.collection('inserts');

		tb1.insert({a:1}, function(err, res){
			if(err){
				console.log("insert fail..", err);
				db.close();
			}else{
				// res是插入的结果
				console.log(res);
			};
			
			// 更新数据
			tb1.update({a:1}, {$set: {b:2}}, function(err, res){
				if(err){
					console.log("update fail..");
					db.close();
				}else{
					console.log("Update feild count:" + res);
					
					// 查询最新数据
					// $gte是“大于等于”的含义
					tb1.find({a: {$gte:1}}).toArray(function(err, docs){
						console.log("Date for this doc:");
						console.dir(docs);
						
						db.close();
					});
				}
			});
			
			// 删除数据..
			// tb1.remove
			
			
		});
		
		
	}
});

