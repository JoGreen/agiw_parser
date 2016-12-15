var isa = require('./isa');
var thesaurus = require('./synonim');

isa('cannaviccio1.xml',function(seed){
	console.log('\n---SEED---\n['+seed+']');
	thesaurus(seed,function(syn){
		console.log('---SINONIMI---\n['+syn+']');
	})

})