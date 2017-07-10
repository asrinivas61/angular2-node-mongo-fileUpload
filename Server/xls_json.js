var node_xj = require("xls-to-json");
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var myCollection, db;

function mongoDump(fileName) {
	async.waterfall(
	    [
	        function(callback) {
	        	node_xj({
				    input: __dirname + '/uploads/'+fileName,
				  	output: __dirname + '/output/output.json'
				  }, function(err, result) {
				    if(err) {
				      console.error(err);
				    } else {
				    	console.log(result);
				    }
	            callback(null, result);
	        	})
	        },
	        function(result, callback) {
	            db = MongoClient.connect('mongodb://127.0.0.1:27017/myDB', function(err, db) {
	            	if(err)
			        	throw err;
			    	console.log("connected to the mongoDB !");
	            callback(null, db, result);
	            });
	        },
	        function(db, result, callback) {
	            myCollection = db.collection('wipro_emp_records')
	            				.insertMany(result, function(err, result) {
				    if(err)
				        throw err;
				    console.log("entry saved");
	            callback(null, result);
				});
	        }
	    ],
	    function (err, result) {
	        console.log('db connections closing');
	    }
	);
}

module.exports = mongoDump;