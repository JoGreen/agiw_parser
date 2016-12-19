var isa = require('./isa');
var thesaurus = require('./synonim');
var sentences = require('./sentences');
var async = require('async');
var fs = require('fs');
var thesaurus_bis = require('./thes2');

//parser --> {titolo, pe, se, sentences}
//isa input = first sentence
//isa output = lista di seed 

sentences('wiki_00.xml',function(docs_sentences) {

	let i = 0;

	async.whilst(

		function() {
			return i !== 2000;
		},

		function(callback) {

			async.waterfall([
				
				function(callback_) {
					isa(docs_sentences[i].sentences,function(seeds) {
						docs_sentences[i].seeds = seeds;
						callback_(null,seeds);
					});
				},

				function(seeds,callback_) {
					thesaurus_bis(seeds,function(syn) {
						docs_sentences[i].synonyms = syn;
						callback_(null);
					});
				},

				function(callback_) {
					console.log(process.memoryUsage());
					console.log('-----------------'+i+'-----------------------');
					//console.log(docs_sentences[i].seeds);
					//console.log(docs_sentences[i].synonyms);
					i++;
					callback(null,i);
				}

				],

				function(err,result) {
					console.log(result);
				}

			);

			/*
				isa(docs_sentences[i].sentences,function(seeds) {
					//console.log('\n---SEEDS---\n['+seeds+']');
					docs_sentences[i].seeds = seeds;
					thesaurus(seeds,function(syn){
						//console.log('---SINONIMI---\n['+syn+']');
						docs_sentences[i].synonyms = syn;
					});
				});
			*/

		},

		function(err) {
			for(i=0 ; i<2000 ; i++ ) {
				fs.appendFile("output.txt",'Seeds: ['+docs_sentences[i].seeds.toString()+']'+'\r\n'+'Sinonimi: ['+docs_sentences[i].synonyms.toString()+']\r\n\r\n',function(err) {
					if(err) {
						return console.log(err);
					}
				});
			}
		}
	);

//chiusura modulo sentences
});