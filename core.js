var fs = require('fs');
var async = require('async');
//var parser = require('./parser_bigxml');
var parser = require('./parser');
var isa = require('./isa');
var synonyms = require('./synonyms');
var pagemention = require('./pagemention');
var pronouns = require('./pronouns');
var name_list = require('./names');

let all_names = [];
name_list.names(function(names){
	all_names = names;
});

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
					isa(parser_out[i].first_sentence,i,function(seeds) {
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
				parser_out[i].pronoun = pronouns(parser_out[i].text);
				//console.log("\r\nPE: "+parser_out[i].pe+'\r\nSeeds: ['+parser_out[i].seeds.toString()+']'+'\r\n'+'Sinonimi: ['+parser_out[i].synonyms.toString()+']\r\n\r\n');

				pagemention_count[i] = pagemention(parser_out[i],all_names);

				fs.appendFile("output_data/output_pagemention.txt",'********\r\nID: '+pagemention_count[i].id +' PE: '+parser_out[i].pe[0]+'\r\nKeywords: '+pagemention_count[i].keywords+'\r\nPronoun: '+ parser_out[i].pronoun+'\r\nPE count: '+pagemention_count[i].primary_entity+'\r\nSeeds: '+pagemention_count[i].seeds+'\r\nSinonimi: '+pagemention_count[i].syn+'\r\nPronomi: '+pagemention_count[i].pronoun+'\r\nTESTO TAGGATO:\n'+pagemention_count[i].text+'\r\n\r\n',function(err) {
					if(err) {
						return console.log(err);
					}
				});

				fs.appendFile("output_data/output_tsv.tsv",pagemention_count[i].id +'\t'+pagemention_count[i].primary_entity+'\t'+pagemention_count[i].seeds+'\t'+pagemention_count[i].syn+'\t'+pagemention_count[i].pronoun+'\r\n', function(err) {
					if(err) {
						return console.log(err);
					}
				});
			}

		}

	);
});
