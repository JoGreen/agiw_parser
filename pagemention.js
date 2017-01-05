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

			var tag,tag_closed;

			if(pe.indexOf(keywords[j])!=-1) {
				tag = '<PE>';
				tag_closed = '</PE>';

			}
			else if(seeds.indexOf(keywords[j])!=-1) {
				tag = '<SEED>';
				tag_closed = '</SEED>';
			}
			else if(synonyms.indexOf(keywords[j]) !== -1) {
				tag = '<SYNONYM>';
				tag_closed = '</SYNONYM>';
			}
			else {
				tag='<PRONOUN>';
				tag_closed = '</PRONOUN>';
			}


			if(tag === '<PE>' && text[i].indexOf('<PE>') === -1){

				var reg = new RegExp("[^a-zA-Z[|]"+keywords[j]+"[ ']","ig");
				//let reg_pe_into_square = new RegExp('\[\[[a-z0-9é°à#§ù,.\-_!?"£%&\/<>| ]*'+keywords[j]+'[a-z0-9é°à#§ù,.\-_!?"£%&\/<>| ]*\]\]','ig');

				if(text[i].indexOf(keywords[j])===0){
						text[i] = text[i].replace(keywords[j],tag+keywords[j]+tag_closed);
				}
				else {
					text[i] = text[i].replace(reg,function(match){
						if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
							return match;
						}
						else
							return match.charAt(0)+tag+keywords[j]+tag_closed+match.charAt(match.length-1);
					});
				}
			}
			else if(tag === '<SEED>' || tag === '<SYNONYM>') {

				if(text[i].indexOf('<PE>')==-1 && tag === '<SEED>' || text[i].indexOf('<PE>')==-1 && text[i].indexOf('<SEED>')==-1 && tag === '<SYNONYM>') {
					let regs = [" The "+keywords[j]+"[^a-zA-Z]","^The"+keywords[j]+"[^a-zA-Z]"];
					var reg = new RegExp(regs.join('|'),"ig");
					text[i] = text[i].replace(reg,function(match){
					if(match=='' && text[i].indexOf(match)==0){
						return tag+keywords[j]+tag_closed;
					}
					else if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag+'The '+keywords[j]+tag_closed+match.charAt(match.length-1);
					});
				}
			}
			else {
				let regs = ["[.]{1} "+keywords[j]+"[^a-zA-Z]","[,]{1} "+keywords[j]+"[^a-zA-Z]","^"+keywords[j]+"[^a-zA-Z]"];
				var reg = new RegExp(regs.join('|'),"ig");
				text[i] = text[i].replace(reg,function(match){
					if(match=='' && text[i].indexOf(match)==0){
						return tag+keywords[j]+tag_closed;
					}
					else if(text[i].indexOf('[[')!==-1 && text[i].indexOf(keywords[j]) > text[i].indexOf('[[') && text[i].indexOf(keywords[j]) < text[i].indexOf(']]')) {
						return match;
					}
					else
						return match.charAt(0)+tag+keywords[j]+tag_closed+match.charAt(match.length-1);
				});
			}

		}

		let count_pe = (text[i].match(/<PE>/g) || []).length;
		let count_seeds = (text[i].match(/<SEED>/g) || []).length;
		let count_syn = (text[i].match(/<SYNONYM>/g) || []).length;
		let count_pron = (text[i].match(/<PRONOUN>/g) || []).length;

		if((count_pe+count_seeds+count_syn+count_pron)>0){
			texto.push(text[i]);
		}

	}

	var testo = text.join('\n');

	//let reg_nested_pe = /<PE>[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*<PE>[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*<\/PE>[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*<\/PE>/ig;
	
	/*
	while(reg_nested_pe.test(testo)) {
		testo = testo.replace(reg_nested_pe,function(match){

			return '<PE>'+match.split(/<PE>|<\/PE>| /g).join(' ')+'</PE>';
		})
	}
	*/
	

	let count_pe = (testo.match(/<PE>/g) || []).length;
	let count_seeds = (testo.match(/<SEED>/g) || []).length;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length;
	let count_pron = (testo.match(/<PRONOUN>/g) || []).length;

	articolo.text = texto;

	let articolo_obj = {id: articolo.id, keywords: keywords, primary_entity: count_pe, seeds: count_seeds, syn: count_syn, pronoun: count_pron};

	return articolo_obj;

}