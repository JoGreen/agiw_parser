var fs = require("fs");
var parseString = require('xml2js').parseString;
var tokenizer = require('sbd');
var unique = require('array-unique');
//var bigXml = require('big-xml');

function clean_text(sentence,separators) {

      var array_entity = sentence.replace(/\(.*?\)/g,'').split(new RegExp(separators.join('|'),'g'));
      for(i=0;i<array_entity.length;i++){
         array_entity.splice(i,1);
       }

      for(i in array_entity){
        if(array_entity[i].length>=80){
          array_entity.splice(i,1);
          i--;
        }
      }

      if(array_entity.length==0)
        console.log("!!!ERROR!!!");

      return array_entity;
};

/*
function remove_tonde(text){
  var text2;
  var aperte;

  while (text.indexOf('(')!=-1){
    text2 = text;

    while(text2.indexOf('(')!=-1){
      aperte = text2.substring(text2.indexOf('('));
      text2 = text2.substring(text2.indexOf('(')+1);
    }

    var chiuse = aperte.indexOf(')')+1;
    if (chiuse==0){
      text = text.replace(aperte, aperte.replace('(',''));
    }
    else {
      var temp = aperte.substring(0,chiuse);
      text = text.replace(temp,'');
    }

  }
  return text;
  };

function remove_graffe(text,title){

  var text2 = text;

  while(text2.indexOf('{|')!=-1){
    text2 = text2.substring(text2.indexOf('{|'));
    var s = text2.substring(0,text2.indexOf('|}')+2);

    text = text.replace(s,'');
    text2 = text2.replace(s,'');
  }

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
      }
    else{
        if(temp.toUpperCase().indexOf(title[0].toUpperCase())!=-1)
          text = text.replace(temp,title);
          else
          text = text.replace(temp,'');
        }
   }
   return text;
};
*/

function remove_file(text){

  let reg = /\[\[File[a-z:0-9,.:;!"£$%&\/()=?'^ì_+|[\]{}èé§ùàòç\- ]*\]\]/ig;
  while(reg.test(text) ){ //dovrebbe non servire il while, fa tutto in una passata
    text = text.replace(reg, '');
  }

  text = text.replace(reg, '');
  return text;

};


function remove_image(text){

  let reg = /\[\[Image[a-z:0-9,.:;!"£$_%&\/()=?'^ì+|[\]{}èé§ùàòç\- ]*\]\]|image:[a-z:0-9,.:;!"£$%&\/()=?'^ì+|[\]è_é§ùàòç\- ]*/ig;
  while(reg.test(text) ){ //dovrebbe non servire il while, fa tutto in una passata
    text = text.replace(reg, '');
  }

  text = text.replace(reg, '');
  return text;

}



function remove_tonde(text){

  let reg = /[(][^()]*[a-z;\-."&%$£!^:,è_é§ùàòç{}' ]*[)]/ig;
  while(reg.test(text) ){
    text = text.replace(reg, '');
  }
  reg = /(|)/g;
  text = text.replace(reg, '');
  return text;

}

function remove_graffe(text, title){
  var text2 = text;

  while(text2.indexOf('{|') !== -1){
    text2 = text2.substring(text2.indexOf('{|'));
    var s = text2.substring(0,text2.indexOf('|}')+2);

    text = text.replace(s,'');
    text2 = text2.replace(s,'');
  } // TOGLIE TUTTE QUESTE STRUTTURE CHE SONO TIPO INFOBOX


  let reg = /[{][^{}]*[a-z;\-."&%$èé§ùàòç?!£!^:,|()' ]*[}]/ig;
  while(reg.test(text) ){
    text = text.replace(reg, '');
  }
  reg = /{|}/g;
  text = text.replace(reg, '');
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

           for(k=2000;k<result.doc.page.length;k++) {

              var title = result.doc.page[k].title;
              console.log(title);
              var id = result.doc.page[k].id;
              var text = result.doc.page[k].revision[0].text[0]._;

              if(text.indexOf("#REDIRECT")!=-1) {
                out.push({id: id, pe: [title], first_sentence: '', text: []});
                continue;
              }

              var array_text = new Array();
              var i = 0;

              text = text.replace(/ \'\'{{.*}}\'\' /g,'');

              text = remove_graffe(text,title);
              text = remove_tonde(text);
              text = remove_file(text);
              text = remove_image(text);
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

              var regex = /<ref>(.*?)<\/ref>?|<ref .*?>(.*?)<\/ref>?|<ref .*?\/>|<(?:.|[\r\n])*?>|&lt;.*&gt;|<!--.*-->|&quot;|&lowast;/g;
              text = text.replace(regex, '');
              text = text.replace(/&nbsp;|&ndash;/g, ' ');
              text = text.replace(/gallery caption=.*\/gallery/g,'');

              var frasi = text.split('\n');
              var testo = [];

              var separators = ["\'\'\'\'\'","\'\'\'"];

              for( var i = 0; i < frasi.length; i++ ) {
                if(frasi[i]!="" && frasi[i].indexOf(".")!=-1 && frasi[i].indexOf("*")==-1 || frasi[i].indexOf("'''")!=-1){
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

              let pe = title.concat(clean_text(first_sentence,separators));

              let pe_temp = [];

              for(j in pe){
                pe[j] = pe[j].replace(/\|.*?]]/g,' ');
                pe[j] = pe[j].replace(/\[|\]/g,'');
                pe_temp.push(pe[j]);
              }

              pe = pe_temp;
              pe = unique(pe);

              let pe_check = pe;

              for(z in pe_check) {
                pe_check[z] = pe_check[z].toLowerCase();
              }

              pe_check = unique(pe_check);

              var testo_intero = testo.join('\n');
              var se = testo_intero.match(/\[\[[a-zA-Z 0-9.'|()-]+\]\]/g);

              se = (se) ?  unique(se): [];

              console.log('--------');
              let anchor = [];
              for(n in se){
                anchor.push(se[n].replace(/\[\[/g,''));
                if(se[n].indexOf('|') !== -1)
                     anchor[n] =  anchor[n].substr(anchor[n].indexOf('|')+1);
                anchor[n] = anchor[n].replace(/\]\]/g,'');
                anchor[n] = anchor[n].toLowerCase();
              };
              anchor = unique(anchor);

              anchor = anchor.filter(function(val) {
                return pe_check.indexOf(val) === -1;
              })

              for(w in anchor) {
                if(anchor[w] === '' || anchor[w].length === 1) {
                  anchor.splice(w,1);
                }
              }

              anchor.sort(function(a,b){
                return a.length - b.length;
              });

              let abbreviations = ["Mt","c","ca","e.g","et al","etc","i.e","p.a","Dr","Gen","Hon","Mr","Mrs","Ms","Prof","Rev","Sr","Jr","St","Assn","Ave","Dept","est","fig","inc","mt","no","oz","sq","st","vs"];

              let options = {
                  "newline_boundaries" : false,
                  "html_boundaries"    : false,
                  "sanitize"           : false,
                  "allowed_tags"       : false,
                  "abbreviations"      : abbreviations
              };

              var array_temp = tokenizer.sentences(testo_intero,options);

              let callback_obj = {id: id, pe: pe, first_sentence: first_sentence, se: anchor, text: array_temp};

              out.push(callback_obj);

              console.log("Articolo "+k+" "+pe);

           }

           callback(out);

     });
  });
}
