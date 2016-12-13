var isa = require('./isa');
var thesaurus = require('./synonim');

isa('brad.txt',function(seed){
	console.log(seed);
	thesaurus(seed,function(syn){
		console.log(syn);
	})

})