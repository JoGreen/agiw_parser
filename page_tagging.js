var wiki_text = './input_data/wiki_00_sections.txt';
var articoli_mentions = './input_data/articoli_out.txt';
var fs = require("fs");
var synonyms = require('./synonyms');
var tcom = require('thesaurus-com');
var async = require('async');


function getSyns(seeds,syns){
  async.whilst(
    function(callback) {
      async.waterfall([
        function(seeds,callback_) {
          synonyms(seeds,function(synonyms) {
            syns = synonyms;
            //callback_(null);
          });
        },
      ],
      function(err,result) {
      //console.log(result);
      }
    );
  });
}

fs.readFile(wiki_text,function(err_articoli, data_articoli) {
  if(err_articoli) {
    console.log(err_articoli);
  }

  fs.readFile(articoli_mentions, function(err_itspsn, data_itspsn){
  			if(err_itspsn){
  				console.log(err_itspsn);
  			}

  var keywords = JSON.parse(data_itspsn.toString());
  var not_title = new RegExp("(.*?)\n\n", "g");
  var empty_line = new RegExp("^\s*$", "gm");
  var doc_tag = new RegExp("<doc (.*?)>", "g");

  data_articoli = data_articoli.toString();
  data_articoli = data_articoli.replace(not_title, "");
  data_articoli = data_articoli.replace(empty_line, "");
  data_articoli = data_articoli.replace(doc_tag, "");
  data_articoli = data_articoli.split("<\/doc>");
  data_articoli.pop();

  for(var i=0; i<data_articoli.length; i++) {
    var article_split = data_articoli[i].split(/=======.*?=======/ig);
		var abstract = article_split[0];
		article_split.splice(0,1);
    data_articoli[i] = {abstract: abstract, body: article_split.join("")};
  }

  console.log(keywords.length);

  for(var i=0; i<keywords.length; i++){

    var syns = [];
    var id = keywords[i].id;
		var title = keywords[i].title;
		var se = keywords[i].se;
		var pe = keywords[i].pe;
		var seeds = keywords[i].seeds;
    var pe_words = [];

    synonyms(seeds,function(output) {
      //console.log(output);
      syns = output;
      //callback_(null);
    });

		for(var k=0;k<pe.length;k++){
			var words = pe[k].split(' ');

			if(words.length>1)
				for(var j=0;j<words.length;j++){
					if(se.indexOf(words[j])===-1 && words[j].length>3){
							pe_words.push(words[j]);
            }
          }
      }

      for(var j=0; j<pe.length; j++) {
        if(pe[j]!=""){
				 regex = new RegExp(pe[j]+'[ .,;:"]', "ig");
				 data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|PE] ");
				 data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|PE] ");
       }
			}
			for(var j=0; j<se.length; j++) {
        if(se[j]!=""){
				  regex = new RegExp(se[j]+'[ .,;:"]', "g");
				  data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SE] ");
				  data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SE] ");
        }
			}
			for(var j=0; j<seeds.length; j++) {
        if(seeds[j]!=""){
          regex = new RegExp("the "+seeds[j]+'[ .,;:"]', "ig");
				  data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SEED] ");
				  data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SEED] ");
        }
			}
      for(var j=0; j<pe_words.length; j++) {
        if(pe_words[j]!=""){
          regex = new RegExp(pe_words[j]+'[ .,;:"]', "ig");
          data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|PE_WORD] ");
          data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|PE_WORD] ");
        }
      }
      for(var j=0; j<syns.length; j++) {
        regex = new RegExp("the "+syns[j]+'[ .,;:"]', "ig");
        data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SYN] ");
        data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SYN] ");
      }


      for(var j=0; j<pe.length; j++) {
        if(pe[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|PE\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+pe[j]+"|PE]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "["+pe[j]+"|PE]");
         }
      }
      for(var j=0; j<seeds.length; j++) {
        if(seeds[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|SEED\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+seeds[j]+"|SEED]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+seeds[j]+"|SEED]");
        }
      }
      for(var j=0; j<se.length; j++) {
        if(se[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|SE\\]", "g");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+se[j]+"|SE]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "["+se[j]+"|SE]");
         }
      }
      for(var j=0; j<pe_words.length; j++) {
        if(pe_words[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|PE_WORD\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex,"["+pe_words[j]+"|PE_WORD]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "["+pe_words[j]+"|PE_WORD]");
         }
      }
      for(var j=0; j<syns.length; j++) {
      	 regex = new RegExp("\\["+j+"\\|SYN\\]", "ig");
      	 data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+syns[j]+"|SYN]");
      	 data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+syns[j]+"|SYN]");
      }

      var regex = '';
			var pe_count = 0;
			var se_count = 0;
			var seeds_count = 0;
			var pe_words_count = 0;
      var syn_count = 0;

      var matches_abstract = [];
      var matches_body = [];
      matches_abstract = data_articoli[i].abstract.match(/\|PE]/ig);
      matches_body = data_articoli[i].body.match(/\|PE]/ig);

      if(matches_abstract !== null) {
      	pe_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	pe_count += matches_body.length;
      }
      matches_abstract = data_articoli[i].abstract.match(/\|SE]/ig);
  	  matches_body = data_articoli[i].body.match(/\|SE]/ig);

      if(matches_abstract !== null) {
      	se_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	se_count += matches_body.length;
      }
      matches_abstract = data_articoli[i].abstract.match(/\|SEED]/ig);
      matches_body = data_articoli[i].body.match(/\|SEED]/ig);

      if(matches_abstract !== null) {
      	seeds_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	seeds_count += matches_body.length;
      }

      matches_abstract = data_articoli[i].abstract.match(/\|PE_WORD]/ig);
      matches_body = data_articoli[i].body.match(/\|PE_WORD]/ig);

      if(matches_abstract !== null) {
        pe_words_count = matches_abstract.length;
      }
      if(matches_body !== null) {
        pe_words_count += matches_body.length;
      }

      matches_abstract = data_articoli[i].abstract.match(/\|SYN]/ig);
      matches_body = data_articoli[i].body.match(/\|SYN]/ig);

      if(matches_abstract !== null) {
        syn_count = matches_abstract.length;
      }
      if(matches_body !== null) {
        syn_count += matches_body.length;
      }

      fs.appendFile('./output_data/page_tagging_out.txt', '=== '+title+' ==='+'\r\n'+'\r\n'+'PE: '+pe+' ---> '+pe_count+'\r\n'+'PE_WORDS: '+pe_words+' ---> '+pe_words_count+'\r\nSE: '+se_count+'\r\nSEEDS: '+seeds+' ---> '+seeds_count+'\r\nSYNONISMS: '+syns+' ---> '+syn_count+'\r\n'+'---------------------\n'+'Abstract:'+data_articoli[i].abstract+'Body:'+data_articoli[i].body+'\r', function(err) {
      		if(err) {
      				console.log(err);
      						}
                })

        }
      })
});
