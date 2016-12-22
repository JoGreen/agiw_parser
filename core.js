var fs = require('fs');
var async = require('async');
var parser = require('./parser');
var isa = require('./isa');
var synonyms = require('./synonyms');


parser('cannaviccio1.xml',function(parser_out) {

	let i = 0;

	async.whilst(

		function() {
			return i !== parser_out.length;
		},

		function(callback) {

			async.waterfall([
				
				function(callback_) {
					isa(parser_out[i].first_sentence,function(seeds) {
						parser_out[i].seeds = seeds;
						setTimeout(() => { callback_(null,seeds); });
					});
				},

				function(seeds,callback_) {
					synonyms(seeds,function(syn) {
						parser_out[i].synonyms = syn;
						callback_(null);
					});
				},

				function(callback_) {
					console.log('-----------------'+i+'-----------------------');
					i++;
					callback(null,i);
				}

				],

				function(err,result) {
					console.log(result);
				}

			);

		},

		function(err) {
			
			for(i=0 ; i<parser_out.length ; i++ ) {
				fs.appendFile("output_data/output_isa.txt",'********\r\nFrase: '+parser_out[i].first_sentence+'\r\nSeeds: ['+parser_out[i].seeds.toString()+']'+'\r\n'+'Sinonimi: ['+parser_out[i].synonyms.toString()+']\r\n\r\n',function(err) {
					if(err) {
						return console.log(err);
					}
				});
			}

		}
	);

});