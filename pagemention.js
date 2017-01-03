var unique = require('array-unique');

module.exports = function(articolo){

	var text = articolo.text;
	var pe = articolo.pe;
	var seeds = articolo.seeds;
	var synonyms = articolo.synonyms;
	var keywords = [];
	keywords = keywords.concat(pe);
	keywords = keywords.concat(seeds);
	keywords = keywords.concat(synonyms);
	keywords = keywords.concat([articolo.pronoun]);

	keywords = unique(keywords);


	let wiki_docs = [];

	//console.log('TESTO PRE TAG:\n'+text.join('\n'));


	for(i in text){
		//wiki_docs.push({id:docs_list[i].id, text:[] });

		//console.log('paragraph PRE:\n'+paragraph);

		for (j in keywords){

			var tag;

			if(pe.indexOf(keywords[j])!=-1)
					tag = '<PE>';
			else if(seeds.indexOf(keywords[j])!=-1)
					tag = '<SEED>';
				else if(synonyms.indexOf(keywords[j]) !== -1)
					tag = '<SYNONYM>';
					else tag='<PRONOUN>';


			if(tag === '<PE>'){
				var reg = new RegExp("[^a-zA-Z]"+keywords[j]+"[^a-zA-Z]","ig");

				text[i] = text[i].replace(reg,function(match){
					//console.log("MATCH: "+match);
					if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag+keywords[j]+tag+match.charAt(match.length-1);
				});
			}
			else if(tag === '<SEED>' || tag === '<SYNONYM>') {
				var reg = new RegExp("The "+keywords[j]+"[^a-zA-Z]","ig");
				text[i] = text[i].replace(reg,function(match){
					if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag+'The '+keywords[j]+tag+match.charAt(match.length-1);
				});
			}
			else {
				var reg = new RegExp("\. "+keywords[j]+"[^a-zA-Z]","ig");
				text[i] = text[i].replace(reg,function(match){
					if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag + keywords[j]+tag+match.charAt(match.length-1);
				});
			}
			//
			// if(matching.length !== 0){
			// 	wiki_docs[i].text.push(paragraph);
			// 	matching_in_doc= matching_in_doc.concat(matching);
			// 	console.log('--'+paragraph);
			// }

		}
		//wiki_docs[i].mentions = matching_in_doc;

	}

	var testo = text.join('\n');
	let count_pe = (testo.match(/<PE>/g) || []).length /2;
	let count_seeds = (testo.match(/<SEED>/g) || []).length /2;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length /2;

	articolo.text = text;
	//console.log('TESTO POST TAG:\n'+testo);

	let articolo_obj = {id: articolo.id, keywords: keywords, primary_entity: count_pe, seeds: count_seeds, syn: count_syn};

	return articolo_obj;
	//console.log("PE: "+count_pe+"\nSEEDS: "+count_seeds+"\nSYNONYMS: "+count_syn);

	//articolo(wiki_docs);
}
