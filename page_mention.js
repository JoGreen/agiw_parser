var isa = require('./isa');
var thesaurus = require('./synonim');

isa('brad.txt',function(seed){
	console.log('pageseed: '+seed);
	thesaurus(seed,function(syn){
		console.log('pagemention.js-+-+-+-+-'+syn);
	})

})