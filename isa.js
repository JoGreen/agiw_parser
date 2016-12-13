var parsing = require('./parser');
var pos = require('pos');
var thesaurus = require('./synonim.js');

let seed_regex =/(NN CC NN|NN , NN|NN , JJ NN|NN CC JJ NN|NN CC NN|NN , CC NN)/i;



module.exports = function(file, callback){
	parsing(file,function(data){
	let first_sentence = data[0];
	let tagger = new pos.Tagger();

	let regex = /( is a | is an | is the | are a | are an | are the| was a | was an | was the | were a | were an | were the )/i;
	let isa = first_sentence.split(regex); //becca solo il primo verbo essere..ottimo.
	//console.log(isa);
	
	//isa[isa.length-1] = 'American linguist, philosopher, cognitive scientist, historian, social critic, and political activist.';
	if (isa.length === 3){
		let words = new pos.Lexer().lex(isa[isa.length-1]);
		let taggedWords = tagger.tag(words);
		//console.log(taggedWords);
		let tag = '';
		for (i in taggedWords){
			tag += taggedWords[i][1]+ ' '; // postag della prima frase dopo 'is a' 
		};
		console.log(tag);
		regex= /( VBN | VB | VBD | VBG | VBP | VBZ )/i;
		tag = tag.split(regex)[0];
		console.log(tag);
		tag_split = tag.split(' ');
		var seed = [];
		isa[isa.length-1] = isa[isa.length-1].replace(/,/g,' ,'); //se c' è una virgola introduce uno spazio prima per evitare che isa_split e tag_split abbiano lunghezza diversa
		let isa_split = isa[isa.length-1].split(' '); // split vector della frase dopo is a --es: american actor and writer.
		console.log(isa_split);
		for (index = tag_split.length-1; index > -1;  index--){
			console.log(tag_split[index]+'---');
			let bool = tag_split[index] === 'NN' ||tag_split[index] === 'NNS';
			//console.log(bool);
			if(tag_split[index] === 'NN' || tag[index] === 'NNS'){
				isa_split[index] = 

				isa_split[index].replace(/(\.|;|:)/,''); //se una parola è seguita da uno dei seguenti simboli senza uno spazio la puliamo per evitare che thesaurus poi si incazzi
				seed.push(isa_split[index]);
				console.log(tag.split(seed_regex).length)
				if(tag.split(seed_regex).length <3){
					break;
				}
			}
			tag_split.pop();
		}
		console.log('seed:\n'+seed);

	}

	callback(seed);
 });

}


