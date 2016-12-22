var fs = require('fs');
var tokenizer = require('sbd');

module.exports = function(file,callback) {

	fs.readFile(file, function(err,data){
		if(err) {
			return console.error(err);
		}
		let docs_id = data.toString().match(/<doc [^>]*>/ig);
		

		data = data.toString().replace(/<\/doc>/ig,'');
		let docs = data.split(/<doc [^>]*>/ig);

		docs.shift();
		fs.appendFile('output_data/docs_id',''+docs.length);

		let docs_sentences = [];
		let first_sentence = ''

		for(i in docs) {
			docs[i] = docs[i].replace(/\n/ig,'');
			docs[i] = docs[i].replace(/\((.*?)\)/ig,'');
			docs[i] = docs[i].replace(/[0-9]{1,50}(st|nd|rd|th) /ig,'');
			docs[i] = docs[i].replace("  "," ");
			let id = docs_id[i].match(/[0-9]+/i)[0];
			

			let sentences = tokenizer.sentences(docs[i]);

			docs_sentences[i] ={id: id, sentences: sentences};

			first_sentence = docs_sentences[i].sentences[0];
		    first_sentence = first_sentence.toLowerCase();
		    first_sentence = first_sentence.replace(/ [!"£$%&\/\(\)#°§*+\/-a-zA-Z]*[0-9]{1,50}[a-zA-Z!"£$%&\/\(\)#°§*+\/-]*/ig, ''); //leva gli alfanumerici
		    first_sentence = first_sentence.replace(/\.|"|:|;/ig,'');
		    first_sentence = first_sentence.replace(/\//ig, ' '); //ho tolto dalla regex l'eliminazione dei trattini
		    first_sentence = first_sentence.replace(/ ,/ig,','); // alcune frasi hanno qualche spazio virgola come refuso
		    

		    docs_sentences[i].sentences[0] = first_sentence;

		    fs.appendFile('output_data/first_sentence.txt', docs_sentences[i].sentences[0]+'\r\n');
		}
		callback(docs_sentences);
	})
}