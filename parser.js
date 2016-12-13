var fs = require("fs");
var parseString = require('xml2js').parseString;
var tokenizer = require('sbd');
//var pos = require('pos');


module.exports = function(file, callback){

fs.readFile(file, function (err, data) {

   if (err) {
      return console.error(err);
   };
   
   data = data.toString().replace(/(<([^>]+)>)|({{([^}]+)}})/ig, '');
   
   

   		separators = ["\'\'\'\'\'","\'\'\'"];
   		pe = data.split(new RegExp(separators.join('|'),'g'));
   		for(i=0;i<pe.length;i++){
   			pe.splice(i,1);
   		}
   		se = data.split('[[');
   		for(i=1;i<se.length;i++){
   			se[i-1] = se[i].substr(0, se[i].indexOf(']]'));
   		}
   		se.pop();

      data = data.replace(/\'\[\]/ig, '');

      var sentences = tokenizer.sentences(data);
      first_sentence = '';
      var found = false;
      var index_first_sentence = 0;
      for (i in sentences){      
            if (sentences[i].indexOf(pe[0]) !== -1 && !found ) {
              first_sentence = sentences[i];
              index_first_sentence = i;
              found = true;
              //console.log(i);
              break;
            }   


      };
      var start_with_pe = first_sentence.startsWith(pe[0]);
      if (!start_with_pe){
        first_sentence = pe[0]+first_sentence.split(pe[0])[1]; 
      };

    //  console.log(first_sentence+'\n-----\n');
    //  console.log(sentences[index_first_sentence]);
      sentences[i] = first_sentence;  //potrebbe essere meglio non metterlo ?
/*
   		console.dir('Primary Entity')
    	console.dir(pe);
    	console.dir('Secondary Entities');
    	console.dir(se); 
*/
      callback(sentences);

  //var words = new pos.Lexer().lex(first_sentence);


   //});
});

}

