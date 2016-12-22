var thesaurus = require('saurus');
var async = require('async');

module.exports=function(isa_words,callback_) {

  let times = isa_words.length ;
  let keywords=[];
  let i = 0;

  async.whilst(

    function(){
      return i !== times
    },
  
    function(callback) {

      thesaurus(isa_words[i]).then(function(matches) {

        console.log('\n'+matches.synonyms.length+' sinonimi trovati');
        keywords =keywords.concat(matches.synonyms);
        //i++;
        //callback(null,i);    

      }).catch(function(e) {
        console.log("c'è stato un errore\n");
      }).then(function() {
        console.log('--------------------'+i+'--------------------------');
        i++;
        callback(null,i);
      });
    
    },

    function(err){
      callback_(keywords);
    }

  );
}


/* prove waterfall--->
async.waterfall([
  function(callback){
    callback(null, 10, 10);
  },
  function(arg1, arg2, callback){
    var arg =arg1+arg2;
    callback(null, arg);
  }
  ],
  function(err, result){
    console.log(result);
  }
  
);

async.waterfall(
    [
        function(callback) {
            callback(null, 'Yes', 'it');
        },
        function(arg1, arg2, callback) {
            var caption = arg1 +' and '+ arg2;
            callback(null, caption);
        },
        function(caption, callback) {
            caption += ' works!';
            callback(null, caption);
        }
    ],
    function (err, caption) {
        console.log(caption);
        // Node.js and JavaScript Rock!
    }
);
*/

  
/*

  //require('dotenv').config();
  //var Wordnet = require('node-wordnet');

  //var key = process.env.THESAURUS_KEY;
  
  thesaurus('activist').then(function(matches){ 
  console.log(matches);
  console.log('-----\n');
  });


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