var fs = require('fs');
var async = require('async');
var parser = require('./parser');
var isa = require('./isa');
var synonyms = require('./synonyms');
var pagemention = require('./pagemention');


parser('cannaviccio1.xml',function(parser_out) {

	let i = 0;
	var pagemention_count = [];

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
					//console.log('-----------------'+i+'-----------------------');
					i++;
					callback(null,i);
				}

				],

				function(err,result) {
					//console.log(result);
				}

			);

		},


		function(err) {


			for(i=0 ; i<parser_out.length ; i++ ) {

				//console.log("\r\nPE: "+parser_out[i].pe+'\r\nSeeds: ['+parser_out[i].seeds.toString()+']'+'\r\n'+'Sinonimi: ['+parser_out[i].synonyms.toString()+']\r\n\r\n');

				pagemention_count[i] = pagemention(parser_out[i]);

				fs.appendFile("output_data/output_pagemention.txt",'********\r\nID: '+pagemention_count[i].id +' PE: '+parser_out[i].pe[0]+'\r\nKeywords: '+pagemention_count[i].keywords+'\r\nPE count: '+pagemention_count[i].primary_entity+'\r\nSeeds: '+pagemention_count[i].seeds+'\r\nSinonimi: '+pagemention_count[i].syn+'\r\nTESTO TAGGATO:\n'+parser_out[i].text.join('\n')+'\r\n\r\n',function(err) {
					if(err) {
						return console.log(err);
					}
				});
			}

		}

	);
});
