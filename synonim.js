var thesaurus = require('saurus');
//require('dotenv').config();
//var Wordnet = require('node-wordnet');

//var key = process.env.THESAURUS_KEY;

/*
thesaurus('activist').then(function(matches){ 
  console.log(matches);
  console.log('-----\n');
});

*/

module.exports=function(isa_words,callback){
  console.log('thesaurus_seeds: '+isa_words);
  var keywords=[];
  for (i in isa_words){
    thesaurus(isa_words[i]).then(function(matches){
        console.log('matches: '+matches.synonyms.length);
        for(index in matches.synonyms){
          //console.log(matches.synonyms[index]);
          keywords.push(matches.synonyms[index]);
          console.log(keywords);
        }
    })
  };
  console.log(keywords+'----\n\n\n++++++++++\n\n----\n+++');
  callback(keywords);
}
  
/*
  "use strict";
  const Synonymator = require("synonymator");


  var syn = new Synonymator(key); 

  syn.synonymsNoun("actor").then(function(data){
    console.log(data)
  });
  /*
  syn.synonymsNoun("time").then(function(data) {
    console.log(data)
  });

  syn.synonymsVerb("time").then(function(data) {
    console.log(data)
  });
  */
  /*
  var wordnet = new Wordnet();

  wordnet.lookup('corporation', function(results) {
    results.forEach(function(result) {
        console.log('------------------------------------');
      //  console.log(result.synsetOffset);
      //  console.log(result.pos);
      //  console.log(result.lemma);
      //  console.log('sinonimi: '+result.synonyms+'\n\n');
      //  console.log(result.gloss);
        if(result.pos === 'n'){
      		wordnet.get(result.synsetOffset,'n',function(result){
    			console.log(result.synonyms+'\n\n\n');
    		})
        }

    });
    });

/*
  wordnet.validForms('company', function(data){
	 console.log('valid form = '+data+'\n\n\n\n---');
	 wordnet.querySense(data[0],function(result){
		  result.forEach(function(elem){
		  	wordnet.findSense(elem, function(sense){
				console.log(sense );	
		})
		})
	});
  });
*/
