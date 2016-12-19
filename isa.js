var pos = require('pos');

// JJ , VBG , JJ JJ JJ TO NNP -> pattern su cui ragionare (il nostro per ora taglia a JJ ,)
let seed_regex =/(NN CC NN|NN , NN|NN , JJ NN|NN CC JJ NN|NN , CC NN|NNS CC NN|NNS CC NNS|NN CC NNS|NNS , NN|NNS , NNS|NN , NNS|NNS , JJ NN|NNS , JJ NNS|NN , JJ NNS|NNS CC JJ NN|NNS CC JJ NNS|NN CC JJ NNS|NNS , CC NN|NNS , CC NNS|NN , CC NNS)/i;

module.exports = function(sentences,callback) {

		let first_sentence = sentences[0];
		let tagger = new pos.Tagger();

		let regex = /( is a | is an | is the | are a | are an | are the | was a | was an | was the | were a | were an | were the )/i;
		let isa = first_sentence.split(regex); //becca solo il primo verbo essere..ottimo.
		
		var seed = [];
		console.log('---FRASE---\n'+first_sentence);
		if (isa.length === 3) {

			let words = new pos.Lexer().lex(isa[isa.length-1]);
			let taggedWords = tagger.tag(words);
			let tag = '';
			for (i in taggedWords){
				tag += taggedWords[i][1]+' '; // postag della prima frase dopo 'is a' 
			};
			console.log('\n---TAG---\n'+tag);
			regex= /( VBN | VB | VBD | VBG | VBP | VBZ | IN )/i;
			tag = tag.split(regex)[0];
			console.log(tag);

			tag_split = tag.split(' ');

			isa[isa.length-1] = isa[isa.length-1].replace(/,/g,' ,'); //se c' è una virgola introduce uno spazio prima per evitare che isa_split e tag_split abbiano lunghezza diversa
			let isa_split = isa[isa.length-1].split(' '); // split vector della frase dopo is a --es: american actor and writer.
			console.log('\n---ISA SPLIT---');
			console.log(isa_split);

			for (index = tag_split.length-1;index > -1;index--) {

				if(tag_split[index] === 'NN' || tag_split[index] === 'NNS'){
					isa_split[index] = isa_split[index].replace(/(\.|;|:)/,''); //se una parola è seguita da uno dei seguenti simboli senza uno spazio la puliamo per evitare che thesaurus poi dia problemi
					seed.push(isa_split[index]);
					if(tag.split(seed_regex).length < 3) {
						break;
					}
				}
				tag_split.pop();
			}
		}
		
		console.log(seed);
		callback(seed);
 	
}