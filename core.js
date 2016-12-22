var isa = require('./isa');
var isa_bis = require('./isa2');
var thesaurus = require('./synonim');
var sentences = require('./sentences');
var async = require('async');
var fs = require('fs');
var thesaurus_bis = require('./thes2');
var parser = require('./parser_new');
var pagemention = require('./pagemention');

//parser --> {titolo, pe, se, sentences}
//isa input = first sentence
//isa output = lista di seed 


let parser_out = [];

parser('cannaviccio1.xml',function(list) {
	parser_out = list;
	//console.log(parser_out[0]);
});


sentences('wiki_00.xml',function(docs_sentences) {

	let i = 0;

	async.whilst(

		function() {
			return i !== docs_sentences.length;
		},

		function(callback) {

			async.waterfall([
				
				function(callback_) {
					isa_bis(docs_sentences[i].sentences,function(seeds) {
						docs_sentences[i].seeds = seeds;
						
						setTimeout(() => { callback_(null,seeds); });
					});
				},

				function(seeds,callback_) {
					thesaurus_bis(seeds,function(syn) {
						docs_sentences[i].synonyms = syn;
						callback_(null);
					});
				},

				function(callback_) {
			//		console.log(process.memoryUsage());
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


		},

		function(err) {
			docs_sentences[0].pe = parser_out[0].pe;
			pagemention([docs_sentences[0]], function(wiki_mentions){
				fs.writeFile('output_data/wiki_mentions',wiki_mentions[0].id+'\n'+
					wiki_mentions[0].text+'\n'+wiki_mentions[0].mentions, function(err){
						if(err)
							console.log(err);
					});
				console.log('---'+parser_out[0].pe);
			})

			/*
				for(i=0 ; i<docs_sentences.length ; i++ ) {
					fs.appendFile("output_data/output.txt",'********\r\nFrase: '+docs_sentences[i].sentences[0]+
						'\r\nSeeds: ['+docs_sentences[i].seeds.toString()+']'+'\r\n'+
						'Sinonimi: ['+docs_sentences[i].synonyms.toString()+']\r\n\r\n',
						function(err) {
						if(err) {
							return console.log(err);
						}
					});
				}
			
				console.log(docs_sentences.length+'  '+parser_out.length);
				/*for(i in docs_sentences){
					if(docs_sentences[i].id !== parser_out[i].id){
						console.log(i);
					}
				} 
			*/
		}
	);

//chiusura modulo sentences
});

