var fs = require('fs');
var tokenizer = require('sbd');

module.exports = function(file,callback) {

	fs.readFile(file, function(err,data){
		if(err) {
			return console.error(err);
		}

		data = data.toString().replace(/<\/doc>/ig,'');
		let docs = data.split(/<doc.*?>/ig);
		docs.shift();

		let docs_sentences = [];

		for(i in docs) {
			docs[i] = docs[i].replace(/\n/ig,'');
			docs[i] = docs[i].replace(/\((.*?)\)/ig,'');
			docs[i] = docs[i].replace("  "," ");
			docs[i] = docs[i].replace(/[0-9].*(st|nd|rd|th) /ig,'');


			let sentences = tokenizer.sentences(docs[i]);
			docs_sentences.push({sentences: sentences});
			let first_sentence = docs_sentences[i].sentences[0];
		//	first_sentence = first_sentence.replace(/\((.*?)\)/ig,''); //toglie apici, quadre e tutto nelle tonde
		//  first_sentence = first_sentence.replace("  "," "); //elimina i doppi spazi
		//  first_sentence = first_sentence.replace(/[0-9].*(st|nd|rd|th) /ig,''); //elimina le sigle di first, second, third, ecc., perché pos si arrabbia
		    first_sentence = first_sentence.toLowerCase();
		    first_sentence = first_sentence.replace(/\.|"|:|;/ig,'');
		    docs_sentences[i].sentences[0] = first_sentence;
		}
		callback(docs_sentences);
	})
}