var isa = require('./isa');
var thesaurus = require('./synonim');
//parser --> {titolo, pe, se, sentences}
//isa input = first sentence
//isa output = lista di seed 
isa('cannaviccio1.xml',function(seed){
	console.log('\n---SEED---\n['+seed+']');
	thesaurus(seed,function(syn){
		console.log('---SINONIMI---\n['+syn+']');
	})

})