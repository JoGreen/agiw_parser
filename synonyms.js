var tcom = require('thesaurus-com');
var async = require('async');


module.exports = function(words, callback_){
//let words = ['absolutism','ascendancy','dominion','empire','government','house','regime','sovereignty','sway']
	if(words.length !== 0){
		let syn = [];

		async.map(words,synonyms,function(err, result){
			for (i in result){
				console.log(i);
				syn = syn.concat(result[i]);
			};
			callback_(syn);
		});
	}

	else{callback_([]);}
	// returns a list of words:
	}


function synonyms(word_, callback){
		let list = tcom.search(word_);
		//console.log(word_+'--'+list.synonyms);
		callback(null, list.synonyms);
	}
