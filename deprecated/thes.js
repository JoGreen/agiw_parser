var updated_thesaurus = require("thesaurus");
var async = require('async');
//var updated_thesaurus = thesaurus.load("./th_en_US_new.dat");


module.exports = function(words, callback_){
//let words = ['absolutism','ascendancy','dominion','empire','government','house','regime','sovereignty','sway']
if(words.length !== 0){
	let syn = [];
	let i = 0;
	//console.log(updated_thesaurus);
	async.whilst(
	  	function(){return i !== words.length},
	  	function(callback){
	  		syn = syn.concat(updated_thesaurus.find(words[i]));
	    	i++;
	    	callback(null, i);
		},

		function(err){
	  		//console.log(syn.split(',').length);
	  		callback_(syn);
		}
	);
}
else{callback_([]);}
// returns a list of words:
}