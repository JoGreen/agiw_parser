var pos = require('pos');
var tokenizer = require('sbd');
var singularize = require('pluralize');


function is_number(word) {
	return word === 'one' || word === 'two' || word === 'three' || word === 'four' || word === 'five' || word === 'six' || word === 'seven' || word === 'eight' || word === 'nine' || word === 'ten' || word === 'first' || word === 'second' || word === 'third' || word === 'fourth' || word === 'fifth' || word === 'sixth' || word === 'seventh' || word === 'eighth' || word === 'ninth' || word === 'tenth';
}

function is_nationality(word) {
	return word === 'algerian' || word === 'australian' || word === 'american' || word === 'belgian' || word === 'brazilian' || word === 'european' || word === 'italian' || word === 'hungarian' || word === 'moroccan' || word === 'norwegian' || word === 'greek' || word === 'iraqi' || word === 'israeli' || word === 'thai' || word === 'chinese' || word === 'japanese' || word === 'portuguese' || word === 'russian' || word === 'slovaks' || word === 'swiss'
	|| word === 'british' || word === 'english' || word === 'french' || word === 'irish' || word === 'spanish' || word === 'dutch' || word === 'welsh' || word === 'danish' || word === 'finnish' || word === 'polish' || word === 'swedish' || word === 'turkish';
}

module.exports = function(sentence,n,callback) {

	let abbreviations = ["c","ca","e.g","et al","etc","i.e","p.a","Dr","Gen","Hon","Mr","Mrs","Ms","Prof","Rev","Sr","Jr","St","Assn","Ave","Dept","est","fig","inc","mt","no","oz","sq","st","vs"];

	let options = {
	    "newline_boundaries" : false,
	    "html_boundaries"    : false,
	    "sanitize"           : false,
	    "allowed_tags"       : false,
	    "abbreviations"      : abbreviations
	};

	let tokenization = tokenizer.sentences(sentence,options);

	if(typeof tokenization[0] !== 'undefined') {
		sentence = tokenization[0];
	}

	// Regex di pulizia della prima frase
	sentence = sentence.toLowerCase();  //tutto minuscolo
	sentence = sentence.replace(/\((.*?)\)/ig,'');  //toglie le parentesi tonde
	sentence = sentence.replace(/[0-9]{1,50}(st|nd|rd|th) /ig,'');  //toglie 1st,2nd,ecc.
	sentence = sentence.replace("  "," ");  //toglie i doppi spazi
	sentence = sentence.replace(/ [!"£$%&\/\(\)#°§*+\/-a-zA-Z]*[0-9]{1,50}[a-zA-Z!"£$%&\/\(\)#°§*+\/-]*/ig, '');  //toglie gli alfanumerici
	sentence = sentence.replace(/\'|\.|"|:|;/ig,'');  //toglie la punteggiatura tranne le virgole
    sentence = sentence.replace(/\//ig, ' ');  //toglie le slash
    sentence = sentence.replace(/ ,/ig,',');  //toglie gli spazi-virgola
    sentence = sentence.replace(/\[\[[a-zA-Z0-9#*_\-+;:.@^'"!?£$%&\/() ]*\|/gi,''); //fa rimanere solo gli anchor text delle secondary entities
    sentence = sentence.replace(/\[|\]/ig,'');  //toglie le quadre rimaste

	//console.log(sentence);

	//Individuazione pattern isa
	let regex = /( is a | is an | is the | is any | is one of | is generally | are a | are an | are the | are any | are generally | was | was a | was an | was the | was any | was one of | was generally | were a | were an | were the | were any | were generally | refers to a | refers to an | refers to the | refers to any | is | are | was | were )/i;
	let isa = sentence.split(regex);

	var seeds = [];

	if(isa.length >= 3) {

		isa = isa[2];
		let tagger = new pos.Tagger();
		let words = new pos.Lexer().lex(isa);
		let tagged_words = tagger.tag(words);
		//console.log(isa);


		// rende aggettivi le parole con i trattini
		for(k in tagged_words) {
			if(tagged_words[k][0].indexOf("-") !== -1 || is_number(tagged_words[k][0]) || is_nationality(tagged_words[k][0])) {
				tagged_words[k][1] = 'JJ';
			}
		}

		// stampa tags
		for(k in tagged_words) {
			//console.log(tagged_words[k][1]);
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
				seeds.push(singularize.singular(tagged_words[i][0]));
				i++;
			}
			else {
				break;
			}
		}

	}

	console.log('Articolo '+n+' '+seeds);
	callback(seeds);

};
