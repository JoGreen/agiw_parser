var unique = require('array-unique');

function is_a_person(splitted_title,all_names){
	for (i in all_names){
		let reg = new RegExp('^('+all_names[i]+')$','i');
	//	console.log('regex: '+reg);
		for ( j in splitted_title){
			if(reg.test(splitted_title[j])){
				return true;
			}
		}
	}
	return false;
};

module.exports = function(articolo,names){

	var text = articolo.text;
	var pe = articolo.pe;
	var seeds = articolo.seeds;
	var synonyms = articolo.synonyms;
	var keywords = [];
	


	if(articolo.pronoun === 'he' || articolo.pronoun === 'she'){
		pe[0] = pe[0].replace(/\((.*)\)/ig,'');
		let split_pe = pe[0].split(' ');
		for (x in split_pe) {
			if(split_pe[x] === 'the' || split_pe[x] === 'of' ||  split_pe[x] === 'in' || split_pe[x] === 'on' || split_pe[x] === 'to' || split_pe[x] === 'mr.' || split_pe[x] === 'mrs.' || split_pe[x] === '&')
				split_pe.splice(x,split_pe.length-x);
		}
		if(is_a_person(split_pe,names)) {
			pe = pe.concat([split_pe[split_pe.length-1]]);
		}
	}

	let reg_is_company = / inc[.]| dept\.| corp\.| co\./i;
	if(reg_is_company.test(pe[0])) {
		
		let split_pe = pe[0].split(' ');
		reg_is_company = /inc[.]|dept\.|corp\.|co\./i;
		for(q in split_pe) {
			console.log(split_pe[q]);
			if(reg_is_company.test(split_pe[q]) ){
				split_pe.splice(q,1);
				
			}
		}
		pe = pe.concat([split_pe.join(' ')]);
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
				let regs_list = ["[^a-zA-Z[|(]"+keywords[j]+"[ ']", "^"+keywords[j]+"[ ']"];
				var reg = new RegExp(regs_list.join('|'),"ig");

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
					var reg = new RegExp(regs.join('|'),"igm");
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

	let anchor = articolo.se;

	let reg_nested_square = /\[\[[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\[\[[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\]\][a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\]\]/ig;
	let reg_most_internal_square = /\[\[[^[\]]*[a-z;\-."&%$£!^:,è_é§ùàòç{}' ]*\]\]/ig;

	if(typeof anchor !== 'undefined') {
	  for(i=0;i<anchor.length;i++) {
	  	for(w in texto) {
	    if(anchor[i].indexOf('(') === -1 && anchor[i].indexOf(')') === -1 && texto[w].indexOf('<PE>')===-1) {
	        let reg_se = new RegExp("[^[|]"+anchor[i]+'[^a-z\']|^'+anchor[i],'ig');
	        texto[w] = texto[w].replace(reg_se, function(match){ 
	          return match.charAt(0)+'[['+anchor[i]+']]'+match.charAt(match.length-1);
	        });

	        
	        while(reg_nested_square.test(texto[w])) {
	          texto[w] = texto[w].replace(reg_nested_square,function(match){
	            return match.replace(reg_most_internal_square,anchor[i]);
	          })
	        }
	      }
	  	}
	  }
	}

	let frasi_utili = [];

	for(let i=0;i<texto.length;i++){
		if((texto[i].indexOf('<PE>')!=-1 || texto[i].indexOf('<SEED>')!=-1 || texto[i].indexOf('<SYNONYM>')!=-1 || texto[i].indexOf('<PRONOUN>')!=-1) && (texto[i].indexOf('[[')!=-1))
		  frasi_utili.push(texto[i]);
	}

	var testo = frasi_utili.join('\n');

	let count_pe = (testo.match(/<PE>/g) || []).length;
	let count_seeds = (testo.match(/<SEED>/g) || []).length;
	let count_syn = (testo.match(/<SYNONYM>/g) || []).length;
	let count_pron = (testo.match(/<PRONOUN>/g) || []).length;

	//articolo.text = frasi_utili;

	let articolo_obj = {id: articolo.id, keywords: keywords, primary_entity: count_pe, seeds: count_seeds, syn: count_syn, pronoun: count_pron, text: testo};

	return articolo_obj;

}