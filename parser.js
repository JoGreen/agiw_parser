var fs = require("fs");
var parseString = require('xml2js').parseString;
var tokenizer = require('sbd');
var unique = require('array-unique');

function clean_text(sentence,separators) {

      var array_entity = sentence.split(new RegExp(separators.join('|'),'g'));

      for(i=0;i<array_entity.length;i++)
         array_entity.splice(i,1);

      for(i in array_entity){
        if(array_entity[i].length>=80){
          array_entity.splice(i,1);
          i--;
        }
      }

      if(array_entity.length==0)
        console.log("!!!ERROR!!!"); // PER VEDERE DOVE NON ESTRAIAMO

      return array_entity;
};


function remove_graffe(text,title){

  var text2 = text;

  while(text2.indexOf('{|')!=-1){
    text2 = text2.substring(text2.indexOf('{|'));
    var s = text2.substring(0,text2.indexOf('|}')+2);

    text = text.replace(s,'');
    text2 = text2.replace(s,'');
  } // TOGLIE TUTTE QUESTE STRUTTURE CHE SONO TIPO INFOBOX

   var chiuse;
   var temp;

   var t = text.substring(text.indexOf('{{'));

   while(text.indexOf('{{') != -1){

      t=text;

      while(t.indexOf('{{') != -1){

         var temp = t;
         temp = temp.substring(temp.indexOf('{{')+2);

         if(temp.indexOf('{{')==-1){
            break;
          }
         else{
            t = temp;
            }
      }

      t = t.substring(t.indexOf('{{'));
      chiuse = t.indexOf('}}')+2;
      temp = t.substring(0,chiuse);

    if(temp.toUpperCase().indexOf(title[0].toUpperCase()+"'''|")!=-1){
        text = text.replace(temp,"'''"+title+"'''");
      } // PER L'ENTITA SCRITTE IN MODO PARTICOLARE PER SEGNALARE LA PRONUNCIA
    else{
        if(temp.toUpperCase().indexOf(title[0].toUpperCase())!=-1) // // PER L'ENTITA SCRITTE IN MODO PARTICOLARE PER SEGNALARE LA LINGUA
          text = text.replace(temp,title);
          else
          text = text.replace(temp,'');
        }
   }
   return text;
};


module.exports = function(file,callback) {

  var out = [];

  fs.readFile(file, function (err, data) {

     if (err) {
        return console.error(err);
     }

     parseString(data, function (err, result) {

           if(err) {
              return console.error(err);
           }

           for(k=0;k<result.doc.page.length;k++) {

              var title = result.doc.page[k].title;
              var id = +result.doc.page[k].id;
              var text = result.doc.page[k].revision[0].text[0]._;

              if(text.indexOf("#REDIRECT")!=-1) {
                out.push({id: id, pe: [title], first_sentence: '', text: []});
                continue;
              }

              var array_text = new Array();
              var i = 0;

              text = text.replace(/ \'\'{{.*}}\'\' /g,'');

              text = remove_graffe(text,title);

              text = text.replace(/\[\[File:.*?\.?\]\]\n|\[\[File:.*?\.?\]\]|\[\[Image:.*\.?\]\]|\[\[Image:.*\.?\]\]\n|\[http:.*?\]|\[https:.*?\]/g, '');

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

              for(i = 0; i < array_text.length; i++)
                text = text.replace(array_text[i],'');

              var regex = /<ref>.*?<\/ref>|<(?:.|\n)*?>|&lt;.*&gt;|<!--.*-->|&quot;/g;
              text = text.replace(regex, '');

              var frasi = text.split('\n');
              var testo = [];

              var separators = ["\'\'\'\'\'","\'\'\'"];

              // PER PRENDERE SOLO FRASI NON VUOTE OPPURE CON UN NERETTO
              for( var i = 0; i < frasi.length; i++ ) {
                if(frasi[i]!="" && frasi[i].indexOf(".")!=-1 || frasi[i].indexOf("'''")!=-1){
                    testo.push(frasi[i]);
                  }
              }

               
               var first_sentence = '';
               for(var i = 0; i < testo.length; i++){
                 if(testo[i].indexOf("\'\'\'")!=-1 || testo[i].indexOf("\'\'\'\'\'")!=-1){
                    first_sentence = testo[i];
                    break;
                  }
                }


              //console.log("TESTO PULITO: "+testo.join('\n'));

              var pe = title.concat(clean_text(first_sentence,separators));


              /*
              var se = testo.split('[[');

              for(i=0;i<se.length;i++) {
                 se[i] = se[i].substr(0, se[i].indexOf(']]'));
                 //console.log("ENTITA NUMMERO "+i+": "+se[i]);
              }

              se.pop();
              */

              pe = unique(pe);

              let callback_obj = {id: id, pe: pe, first_sentence: first_sentence, text: testo};
              out.push(callback_obj);

              console.log("Articolo "+k);

              /*
              fs.appendFile("output_data/output_parser.txt", '{Frase: '+first_sentence+'\n'+first_sentence.split('\n').length+'}\r\n'+'['+pe.toString()+'] \r\n\r\n\r\n', function(err) {
                 if(err) {
                    return console.log(err);
                 }
              });
              */

           }

           callback(out);

     });
  });
}