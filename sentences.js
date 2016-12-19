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
			let sentences = tokenizer.sentences(docs[i]);
			docs_sentences.push({sentences: sentences});
		}
		callback(docs_sentences);
	})
}