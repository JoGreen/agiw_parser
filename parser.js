var fs = require("fs");
var parseString = require('xml2js').parseString;
var tokenizer = require('sbd');

function clean_text(sentence,separators) {

      var pe = sentence.split(new RegExp(separators.join('|'),'g'));
                  
      for(i=0;i<pe.length;i++) {
         pe.splice(i,1);
      }

      for(i in pe) {
         if(pe[i].length >= 80) {
            pe.splice(i,1);
            i--;
         }
      }

      return pe;

};

module.exports = function(file,callback) {

fs.readFile(file, function (err, data) {

   if (err) {
      return console.error(err);
   }

   parseString(data, function (err, result) {
         
         if(err) {
            return console.error(err);
         }

         var cont = 0;

         //for(k=0;k<result.doc.page.length;k++) {

            var text = result.doc.page[598].revision[0].text[0]._;
            var array_text = new Array();
            var i = 0;
            var text2 = text;

            while(text2.indexOf('[[File:') != -1) {
               var file = text2.substring(text2.indexOf('[[File:'));
               array_text[i] = file.substr(0, file.indexOf(']]\n')+2);
               i++;
               text2 = text2.substring(text2.indexOf(']]\n') + 2);
            }

            var text2 = text;

            while(text2.indexOf('[[Image:') != -1) {
               var file = text2.substring(text2.indexOf('[[Image:'));
               array_text[i] = file.substr(0, file.indexOf(']]\n')+2);
               i++;
               text2 = text2.substring(text2.indexOf(']]\n') + 2);
            }

            text2 = text;
            var file = text2.substring(text2.indexOf('{{'));

            if(text2.indexOf('\n}}') != -1) {
               array_text[i] = file.substr(0, file.indexOf('\n}}')+3);
            }

            for(i = 0; i < array_text.length; i++) {
               text = text.replace(array_text[i],'');
            }  
            
            var regex = ["<(.*?)>(.*?)</(.*?)>","<!--((.|\n)*?)-->","{{((.|\n)*?)}}","''{{((.|\n)*?)}}''","'''{{((.|\n)*?)}}'''"];
            text = text.replace(new RegExp(regex.join('|'),'ig'),'');

            var sentences = tokenizer.sentences(text);

            var separators = ["\'\'\'\'\'","\'\'\'"];
            var first_sentence = sentences[0];

            var pe = clean_text(first_sentence,separators);
            if(first_sentence.indexOf("'''"+pe[0]) !== -1) {
               first_sentence = first_sentence.substring(first_sentence.indexOf("'''"+pe[0]));
            }
            
            if(pe.length == 0 && (typeof sentences[1] != 'undefined')) {

               first_sentence = sentences[1];
               pe = clean_text(first_sentence,separators);
               
               if(first_sentence.indexOf("'''"+pe[0]) !== -1) {
                  first_sentence = first_sentence.substring(first_sentence.indexOf("'''"+pe[0]));
               }

            }

            if(pe.length == 0) {
               cont++;
            }
            
            /*
            se = text.split('[[');

            for(i=1;i<se.length;i++) {
               se[i-1] = se[i].substr(0, se[i].indexOf(']]'));
            }

            se.pop();
            */
         
            //console.log("Articolo "+k+" stampato");

            /*
            fs.appendFile("output.txt", '{Frase: '+first_sentence+'}\r\n'+'['+pe.toString()+'] \r\n\r\n\r\n', function(err) {
               if(err) {
                  return console.log(err);
               }
            });
            */

         //}

         //console.log(cont+' miss');

         first_sentence = first_sentence.replace(/\'|\[|\]|\((.*?)\)/ig,''); //toglie apici, quadre e tutto nelle tonde
         first_sentence = first_sentence.replace("  "," "); //elimina i doppi spazi
         //first_sentence = first_sentence.replace(/\[(.*?)\|/ig,''); //fa rimanere solo gli anchor text delle secondary entities
         sentences[0] = first_sentence;
         callback(sentences);

   });
});
}