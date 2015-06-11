var http = require("http");

var server = new http.Server();
server.on("request", function(req, res){
	console.log("It is request..");
	res.end(null);
});

server.listen(3000, function(){
	console.log("listen port 3000...");
});

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var util = require("util");

// Connection URL
var url = "mongodb://localhost:27017/myproject";
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log("Connected correctly to server");
	
	// Insert a document
	inertDocuments(db, function(result){
		// Update the data
		updateDocument(db, function(result){
			// Remove the date
			removeDocument(db, function(result){
				// Search all result
				findDocuments(db, function(docs){
					db.close();
				});
			});
		});
	});
	// db.close();
});

// Insert a document
var inertDocuments = function(db, callback){
	// Get the documents collection
	var collection = db.collection("documents");
	// Insert some documents
	collection.insert([{a:1}, {a:2}, {a:3}], function(err, result){
		if(err){
			console.log("it error");
		}else{
			// result is the data which are included
			console.log("insert success, 3 documents into the document collection");
		}
		
		callback(result);
	});
};

// updating a document
var updateDocument = function(db, callback){
	// Get the documents collection
	var collection = db.collection("documents");
	// update document where a is 2, set b equal to 1
	// if not set {multi:true}, db only modify one doc
	collection.update({a: 2}, {
		$set: {
			b: 1
		}
	}, {multi: true}, function(err, result){
		if(err){
			console.log("update failure");
		}else{
			console.log("update success with the field a equal to 2");
			// "result" is the operation's count
			console.log(result);
		}
		callback(result);
	});
};

// Remove a document
var removeDocument = function(db, callback){
	// Get the documents collection
	var collection = db.collection("documents");
	// Remove a document which a equal to 3
	collection.remove({a:3}, function(err, result){
		if(err){
			console.log("remove fail");
		}else{
			console.log("Remove the document with the field a = 3");
			// "result" is the operation's count
			console.log(result);
		}
		callback(result);
	});
};

// Find all Documents
var findDocuments = function(db, callback){
	// Get the documents collection
	var collection = db.collection("documents");
	// Find some documents
	collection.find({}).toArray(function(err, docs){
		if(err){
			console.log("search fail");
		}else{
			console.log("Found the following records");
			console.dir(docs);
			callback(docs);
		}
	});
};


/*
var mongodb = require("mongodb");
var server = new mongodb.Server("localhost", 27017, {auto_reconnect: true});
var db = new mongodb.Db("mydb", server, {safe: true});

db.open(function(err, db){
	if(err){
		console.log("db connect error");
	}else{
		console.log("db connect success");
	}
});
*/