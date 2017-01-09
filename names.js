var fs = require('fs');
var csv = require('csv-parser');
var async = require('async');


let files=[];
files.push('CSV_Database_Of_First_And_Last_Names/CSV_Database_Of_First_Names.csv');
files.push('CSV_Database_Of_First_And_Last_Names/CSV_Database_Of_Last_Names.csv')
let names = [];

function read(file, callback_){
	fs.createReadStream(file)
	.pipe(csv())
  	.on('data', function (data) {
		if (data.firstname){
			names.push(data.firstname);
		}
		else{
			names.push(data.lastname);
		}
	})
	.on('finish',function(){
		
		callback_(null);
	})
};

module.exports = {

	names : function(callback){
		async.map(files,read, function(err, result){
		//console.log(names);
		callback(names);
		});
	}
}


/*
fs.createReadStream('CSV_Database_Of_First_And_Last_Names/CSV_Database_Of_First_Names.csv')
  .pipe(csv())
  .on('data', function (data) {
    console.log('Name: %s ', data.firstname);
  })*/

