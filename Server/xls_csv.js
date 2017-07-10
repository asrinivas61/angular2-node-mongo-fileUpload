var xlsx = require('node-xlsx');
var MongoClient = require('mongodb').MongoClient;
var readline = require('readline');
var async = require('async');
var fs = require('fs');

var myCollection, db;

var obj = xlsx.parse(__dirname + '/crimes.xls');
var rows = [], writeStr = "";

async.waterfall(
    [
        function(callback) {
            for(var i = 0; i < obj.length; i++) {
                var sheet = obj[i];
                for(var j = 0; j < sheet['data'].length; j++)
                    rows.push(sheet['data'][j]);
            }
            for(var i = 0; i < rows.length; i++)
                writeStr += rows[i].join(",") + "\n";

            fs.writeFile(__dirname + "/output/output.csv", writeStr, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("output.csv was saved in output directory!");
            });
            callback(null);
        },
        function(callback) {
            var headCheck = true, headArr = [], dataLineArr = [], temp=[];

            db = MongoClient.connect('mongodb://127.0.0.1:27017/myDB', function(err, db) {
                if(err)
                    throw err;
                console.log("connected to the mongoDB !");

                const lineReader = readline.createInterface({
                    input: fs.createReadStream('./output/output.csv')
                });

                lineReader.on('line', (line) => {
                    let jsonFile = {};
                    if(headCheck) {
                        headCheck = false;
                        headArr = line.split(/,/g);
                    }
                    dataLineArr = line.split(/,/g);
                    for(i=0; i<headArr.length; i++) {
                        jsonFile[headArr[i]] = dataLineArr[i];
                    }
                    myCollection = db.collection('wipro_emp_records')
                                .insert(jsonFile, function(err, result) {
                        if(err)
                            throw err;
                    });
                });
                callback(null, 'Entry saved successfully');
            });
        }
    ],
    function (err, result) {
        console.log('result: ', result);
    }
);