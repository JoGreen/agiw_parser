var updated_thesaurus = require("thesaurus");
var async = require('async');
//var updated_thesaurus = thesaurus.load("./th_en_US_new.dat");


module.exports = function(words, callback_){
//let words = ['absolutism','ascendancy','dominion','empire','government','house','regime','sovereignty','sway']
if(words.length !== 0){
	let syn = [];
	//let i = 0;
	//console.log(updated_thesaurus);
	async.mapSeries(words,synonyms,
	function(err, result){
		for (i in result){
			syn = syn.concat(result[i]);
		} 
		console.log(syn);
		callback_(syn);
	}
	);
}
else{callback_([]);}
// returns a list of words:
}


function synonyms(word_, callback){
		let list = updated_thesaurus.find(word_);
		//console.log(word_+'--'+list);
		callback(null, list);
	}