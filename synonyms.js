var updated_thesaurus = require("thesaurus");
var async = require('async');


module.exports = function(words, callback_){
//let words = ['absolutism','ascendancy','dominion','empire','government','house','regime','sovereignty','sway']
	if(words.length !== 0){
		let syn = [];
		
		async.map(words,synonyms,function(err, result){
			for (i in result){
				syn = syn.concat(result[i]);
			};
			callback_(syn);
		});
	}

	else{callback_([]);}
	// returns a list of words:
	}


function synonyms(word_, callback){
		let list = updated_thesaurus.find(word_);
		//console.log(word_+'--'+list);
		callback(null, list);
	}