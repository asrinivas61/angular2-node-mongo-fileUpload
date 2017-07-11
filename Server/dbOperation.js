var node_xj = require("xls-to-json");
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var fs = require('fs');

var myCollection, db, actualFileName='', outputArr=[];

var dbConn = function() {
	var db = new Promise((resolve, reject) => {
		MongoClient.connect('mongodb://127.0.0.1:27017/myDB', (err, db) => {
	    	if(err) reject('ERROR: ', err);
	    	console.log("connected to the mongoDB !");
	    	resolve(db);
	    })	
	});
	return db;
}
var xls = function(callback) {
	node_xj({
	    input: __dirname + '/uploads/'+actualFileName,
	  	output: __dirname + '/output/xls_data.json'
	  }, (err, result) => {
	  	try {
	  		if(err) {
            	routerCallback('ERROR:xls/xlsx, while writing file into jsonfile', null);
	  			return;
	  		}
    		callback(null, result);
	  	} catch(e) {
	  		console.log('ERROR: in file conversion, ', e);
	  	}
	})
}

var csv = function(callback) {
	let csvFilePath = './uploads/'+actualFileName;
	var p = new Promise((resolve, reject) => {
        var filename = csvFilePath;
        var json = [];

        var getCommaSeparated = function (str) {
            return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        };

        fs.readFile(filename, function (err, data) {
            if (err) {
                routerCallback('ERROR: CSV, while reading file', null);
            	reject(err);
            }
            var csvIN = data.toString().split(/\r\n|\n|\r/);
            var tokens = getCommaSeparated(csvIN[0]);
            for(var i=1;i < csvIN.length;i++) {
                var content = getCommaSeparated(csvIN[i]);
                var tmp = {};
                for(var j=0;j < tokens.length; j++) {
                    try {
                        tmp[tokens[j]] = content[j];
                    } catch(err) {
                        tmp[tokens[j]] = "";
                    }
                }
                json.push(tmp);
            }
            resolve(json);
        });
	})
	.then((jsonObj) => {
		fs.writeFile('./output/csv_data.json', JSON.stringify(jsonObj), function(err, data) {
            if (err) {
            	routerCallback('ERROR: CSV, while writing file into jsonfile', null);
            	return;
            }
            console.log('Data written to JSON file');
            callback(null, jsonObj);
        });
	})
}

var mongoDump =  function(fileName, routerCallback) {
	actualFileName = fileName;
	let mongoInput;
	let extension = fileName.split(".");
	extension[extension.length-1] == 'csv' ? mongoInput=csv : mongoInput=xls;
	async.waterfall(
	    [
	        mongoInput,
	        function(result, callback) {
	       		MongoClient.connect('mongodb://127.0.0.1:27017/myDB', (err, db) => {
			    	if(err){
			    		routerCallback(err, null);
			    		return;
			    	}
			    	console.log("connected to the mongoDB !");
	            	callback(null, db, result);
			    });
	        },
	        function(db, result, callback) {
	        	db.createCollection('wipro_emp_records', (err, response) => {
	        		if(err) {
	        			routerCallback('ERROR: while creating DB collection', null);
	        			return;
	        		}
	        		console.log('New collection created successfully')
	        		callback(null, db, result);
	        	})
	        },
	        function(db, result, callback) {
	        	db.collection('wipro_emp_records').drop((err, response) => {
	        		if(err) {
			    		routerCallback('ERROR: while dropping DB collection', null);
	        			return;
	        		}
	        		console.log('Old collection dropped successfully')
	        		callback(null, db, result);
	        	});
	        },
	        function(db, result, callback){
	            db.collection('wipro_emp_records')
	            				.insertMany(result, (err, result) => {
				    if(err){
			    		routerCallback('ERROR: while inserting records to DB, pls check file header once', null);
				    	return;
				    }
				    console.log("entry saved to database");
	            	callback(null, result);
				});
	        }
	    ],
	    function (err, result) {
	    	actualFileName = '';
	    	if(err) {
				routerCallback(err, null);
	    		return;
	    	}
	    	routerCallback(null, result);
	        console.log('db connections closing');
	    }
	);
}

var mongoFind = function(id) {
	let db = dbConn();
	var objProm = db.then((db) => {
	    var resultProm = db.collection('wipro_emp_records')
						.findOne({"EMP_CODE": id})
						.then((result) => {
							return result;
						});
		return resultProm;
	});
	return objProm;
}

module.exports = {
	mongoDump: mongoDump,
	mongoFind: mongoFind
}