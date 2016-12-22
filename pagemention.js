module.exports = function(docs_list, callback){
	
	let wiki_docs = [];

	
	for(i in docs_list){
		wiki_docs.push({id:docs_list[i].id, text:[] });
		let matching_in_doc = [];
		for (j in docs_list[i].sentences){

			let paragraph = docs_list[i].sentences[j];
			let pe_regex = new RegExp(docs_list[i].pe.join(' | '),'ig');
			let seeds_regex = new RegExp(docs_list[i].seeds.join('|'), 'ig');
			let synonyms_regex = new RegExp(docs_list[i].synonyms.join('|'), 'ig');
	
			let matching = [];

			//matching.push('\nPE');
			matching = (paragraph.match(pe_regex) !== null) ? matching.concat(paragraph.match(pe_regex)) : matching;
			//matching.push('SEEDS');
			matching = (paragraph.match(seeds_regex) !== null) ? matching.concat(paragraph.match(seeds_regex)) : matching;
			//matching.push('SYNONYMS');
			matching = (paragraph.match(synonyms_regex) !== null) ? matching.concat(paragraph.match(synonyms_regex)) : matching;
			
			
			paragraph = paragraph.replace(pe_regex, '<PE>');
			paragraph = paragraph.replace(seeds_regex, '<SEED>');
			paragraph = paragraph.replace(synonyms_regex, '<SYNONYM>');

			if(matching.length !== 0){
				wiki_docs[i].text.push(paragraph);
				matching_in_doc= matching_in_doc.concat(matching);
				console.log('--'+paragraph);
			}

		}
		wiki_docs[i].mentions = matching_in_doc;
	}
	callback(wiki_docs);
}