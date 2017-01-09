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


async.map(files,read, function(err, result){
	fs.writeFile('output_data/names.txt', names, function(err){
		if(err)console.log(err);
	});
	
});

/*
fs.createReadStream('CSV_Database_Of_First_And_Last_Names/CSV_Database_Of_First_Names.csv')
  .pipe(csv())
  .on('data', function (data) {
    console.log('Name: %s ', data.firstname);
  })*/

