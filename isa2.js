var pos = require('pos');

module.exports = function(sentences,callback) {
	
	let first_sentence = sentences[0];
	console.log(first_sentence);

	let regex = /( is a | is an | is the | is any | is one of | are a | are an | are the | are any | was a | was an | was the | was any | was one of | were a | were an | were the | were any )/i;
	let isa = first_sentence.split(regex);

	var seeds = [];

	if(isa.length >= 3) {

		isa = isa[2];
		let tagger = new pos.Tagger();
		let words = new pos.Lexer().lex(isa);
		let tagged_words = tagger.tag(words);
		console.log(isa);


		// rende aggettivi le parole con i trattini
		for(k in tagged_words) {
			if(tagged_words[k][0].indexOf("-") !== -1) {
				tagged_words[k][1] = 'JJ';
			}
		}

		// stampa tags
		for(k in tagged_words) {
			console.log(tagged_words[k][1]);
		}
		
		let i = 0;
		let init_verbs_index = 0;
		let init_verbs_bool = false;

		// non considera eventuali verbi o prp prima del primo nome
		while(i<tagged_words.length) {
			if(tagged_words[i][1] === 'VBN' || tagged_words[i][1] === 'VBD' || tagged_words[i][1] === 'VB' || tagged_words[i][1] === 'VBG' || tagged_words[i][1] === 'VBP' || tagged_words[i][1] === 'VBZ' || tagged_words[i][1] === 'PRP') {
				init_verbs_index = i;
				init_verbs_bool = true;
				i++;
			}
			else if(tagged_words[i][1] === 'NN' || tagged_words[i][1] === 'NNS') {
				break;
			}
			else {
				i++;
			}
		}

		// se c'è almeno un verbo prima del primo nome parte da dopo l'ultimo di questi verbi altrimenti no
		if(init_verbs_bool) {
			i = init_verbs_index+1;
		}
		else {
			i = 0;
		}

		// applica l'automa
		while(i < tagged_words.length) {
			if(tagged_words[i][1] === 'JJ' || tagged_words[i][1] === 'JJR' || tagged_words[i][1] === 'JJS' || tagged_words[i][1] === 'POS' || tagged_words[i][1] === ',' || tagged_words[i][1] === 'CC' || tagged_words[i][1] === 'DT' || tagged_words[i][1] === 'RB' || tagged_words[i][1] === 'RBR' || tagged_words[i][1] === 'RBS') {
				i++;
			}
			else if((typeof tagged_words[i+1] !== 'undefined') && ((tagged_words[i][1] === 'NN' && tagged_words[i+1][1] === '"' && tagged_words[i+2][1] === 'PRP') || (tagged_words[i][1] === 'NNS' && tagged_words[i+1][1] === '"' && tagged_words[i+2][1] === 'PRP'))) {
				i = i+3;
			}
			else if(tagged_words[i][1] === 'NN' || tagged_words[i][1] === 'NNS') {
				while((typeof tagged_words[i+1] !== 'undefined') && (tagged_words[i+1][1] === 'NN' || tagged_words[i+1][1] === 'NNS')) {
					i++;
				}
				seeds.push(tagged_words[i][0]);
				i++;
			}
			else {
				break;
			}
		}

	}

	callback(seeds);
	
};