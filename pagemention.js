var unique = require('array-unique');

module.exports = function(articolo){

	var text = articolo.text;
	var pe = articolo.pe;
	var seeds = articolo.seeds;
	var synonyms = articolo.synonyms;
	var keywords = [];
	if(articolo.pronoun === 'he' || articolo.pronoun === 'she'){
		pe[0] = pe[0].replace(/\(|\)/ig,'');
		let split_pe = pe[0].split(' ');
		pe = pe.concat(split_pe);
	}
	keywords = keywords.concat(pe);
	keywords = keywords.concat(seeds);
	keywords = keywords.concat(synonyms);
	keywords = keywords.concat([articolo.pronoun]);

	keywords = unique(keywords);

	var texto = [];

	for(i in text){

		for (j in keywords){

			var tag;

			if(pe.indexOf(keywords[j])!=-1)
				tag = '<PE>';
			else if(seeds.indexOf(keywords[j])!=-1)
				tag = '<SEED>';
			else if(synonyms.indexOf(keywords[j]) !== -1)
				tag = '<SYNONYM>';
			else 
				tag='<PRONOUN>';


			if(tag === '<PE>'){

				var reg = new RegExp("[^a-zA-Z]"+keywords[j]+"[^a-zA-Z]","ig");

				text[i] = text[i].replace(reg,function(match){
					
					if(match=='' && text[i].indexOf(match)==0){
						return tag+keywords[j]+tag;
					}
					else if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag+keywords[j]+tag+match.charAt(match.length-1);
				});
			}
			else if(tag === '<SEED>' || tag === '<SYNONYM>') {

				if(text[i].indexOf('<PE>')==-1 && tag === '<SEED>' || text[i].indexOf('<PE>')==-1 && text[i].indexOf('<SEED>')==-1 && tag === '<SYNONYM>') {
					var reg = new RegExp("The "+keywords[j]+"[^a-zA-Z]","ig");
					text[i] = text[i].replace(reg,function(match){
						if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
							return match;
						}
						else
							return match.charAt(0)+tag+'The '+keywords[j]+tag+match.charAt(match.length-1);
					});
				}
			}
			else {

				var reg = new RegExp("[.]{1} "+keywords[j]+"[^a-zA-Z]","ig");
				text[i] = text[i].replace(reg,function(match){
					if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag + keywords[j]+tag+match.charAt(match.length-1);
				});
			}

		}

		let count_pe = (text[i].match(/<PE>/g) || []).length /2;
		let count_seeds = (text[i].match(/<SEED>/g) || []).length /2;
		let count_syn = (text[i].match(/<SYNONYM>/g) || []).length /2;

		if((count_pe+count_seeds+count_syn)>0){
			texto.push(text[i]);
		}

	}

	var testo = text.join('\n');
	let count_pe = (testo.match(/<PE>/g) || []).length /2;
	let count_seeds = (testo.match(/<SEED>/g) || []).length /2;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length /2;

	articolo.text = texto;

	let articolo_obj = {id: articolo.id, keywords: keywords, primary_entity: count_pe, seeds: count_seeds, syn: count_syn};

	return articolo_obj;

}