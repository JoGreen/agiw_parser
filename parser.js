var fs = require("fs");
var parseString = require('xml2js').parseString;
var tokenizer = require('sbd');
var unique = require('array-unique');

function clean_text(sentence,separators) {
    //console.log("FRASE: "+sentence); // PER VEDERE DOVE NON ESTRAIAMO

  //  console.log("\nFRASE: "+sentence.replace(/\(.*?\)/g,'')); // PER VEDERE DOVE NON ESTRAIAMO


      var array_entity = sentence.replace(/\(.*?\)/g,'').split(new RegExp(separators.join('|'),'g'));
      for(i=0;i<array_entity.length;i++){
        //console.log("entita: "+array_entity[i]); // PER VEDERE DOVE NON ESTRAIAMO
         array_entity.splice(i,1);
       }

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
              var id = result.doc.page[k].id;
              var text = result.doc.page[k].revision[0].text[0]._;

              if(text.indexOf("#REDIRECT")!=-1) {
                out.push({id: id, pe: [title], first_sentence: '', text: []});
                continue;
              }

              var array_text = new Array();
              var i = 0;

              text = text.replace(/ \'\'{{.*}}\'\' /g,'');
              //console.log("TESTO PULITO2: \n"+text);

              text = remove_graffe(text,title);
              text = remove_tonde(text);
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

                //console.log("TESTO PULITO2: \n"+text);

              var regex = /<ref>(.*?)<\/ref>?|<ref .*?>(.*?)<\/ref>?|<ref .*?\/>|<(?:.|[\r\n])*?>|&lt;.*&gt;|<!--.*-->|&quot;|&lowast;/g;
              text = text.replace(regex, '');
              text = text.replace(/&nbsp;|&ndash;/g, ' ');
              text = text.replace(/gallery caption=.*\/gallery/g,'');

              //console.log("TESTO PULITO2: \n"+text);

              var frasi = text.split('\n');
              var testo = [];

              var separators = ["\'\'\'\'\'","\'\'\'"];


              // PER PRENDERE SOLO FRASI NON VUOTE OPPURE CON UN NERETTO
              for( var i = 0; i < frasi.length; i++ ) {
                if(frasi[i]!="" && frasi[i].indexOf(".")!=-1 && frasi[i].indexOf("*")==-1 || frasi[i].indexOf("'''")!=-1){
                    testo.push(frasi[i]);
                  }
              }
              //console.log("TESTO PULITO2: \n"+testo.join('\n'));


               var first_sentence = '';

               for(var i = 0; i < testo.length; i++){
                 if(testo[i].indexOf("\'\'\'")!=-1 || testo[i].indexOf("\'\'\'\'\'")!=-1){
                    first_sentence = testo[i];
                    break;
                  }
                }


              //console.log("TESTO PULITO: "+testo.join('\n'));

              var pe = title.concat(clean_text(first_sentence,separators));
              //console.log("ENTITA: "+pe);


              var pe_temp = [];

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

              /*console.log("ENTITA: "+pe);
              var testo_intero = testo.join('\n');
              var se = testo_intero.split('[[');

              for(i=0;i<se.length;i++) {
                 var temp = se[i].substr(0, se[i].indexOf(']]'));

                 if(temp.indexOf('|')!=-1)
                     se[i] = temp.substr(temp.indexOf('|')+1);
                else
                    se[i] = temp;
                testo_intero = testo_intero.replace(temp,se[i]);

              }
              se.shift();
              */

              //console.log("ENTITA: "+pe);
              var testo_intero = testo.join('\n');
              var se = testo_intero.match(/\[\[[a-zA-Z 0-9.'|()-]+\]\]/g);
              
              se = (se) ?  unique(se): [];
              
              
              //console.log(se);
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

              console.log(anchor.indexOf('alabama'));

              anchor.sort(function(a,b){
                return a.length - b.length;
              });

              let reg_nested_square = /\[\[[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\[\[[a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\]\][a-zé°à#§ù,.\-_!?"£%&\/<>| ]*\]\]/ig;
              let reg_most_internal_square = /\[\[[^[\]]*[a-z;\-."&%$£!^:,è_é§ùàòç{}' ]*\]\]/ig;

              for(i=0;i<anchor.length;i++) {
             /*   let temp = se[i].replace(/\[\[/g,'');

                 if(se[i].indexOf('|') !== -1)
                     temp =  temp.substr(temp.indexOf('|')+1);
                  temp = temp.replace(/\]\]/g,'');
            */    if(anchor[i].indexOf('(') === -1 && anchor[i].indexOf(')') === -1) {
                    let reg_se = new RegExp("[^[|]"+anchor[i]+'[^a-z]|^'+anchor[i],'ig');
                    testo_intero = testo_intero.replace(reg_se, function(match){ 
                      return match.charAt(0)+'[['+anchor[i]+']]'+match.charAt(match.length-1);
                    });


                    while(reg_nested_square.test(testo_intero)) {
                      testo_intero = testo_intero.replace(reg_nested_square,function(match){
                        return match.replace(reg_most_internal_square,anchor[i]);
                      })
                    }
                  }
              }


              let abbreviations = ["Mt","c","ca","e.g","et al","etc","i.e","p.a","Dr","Gen","Hon","Mr","Mrs","Ms","Prof","Rev","Sr","Jr","St","Assn","Ave","Dept","est","fig","inc","mt","no","oz","sq","st","vs"];

              let options = {
                  "newline_boundaries" : false,
                  "html_boundaries"    : false,
                  "sanitize"           : false,
                  "allowed_tags"       : false,
                  "abbreviations"      : abbreviations
              };

              var array_temp = tokenizer.sentences(testo_intero,options);
              var frasi_utili = [];

              for(var i=0;i<array_temp.length;i++){
                if(array_temp[i].indexOf('[[')!=-1)
                  frasi_utili.push(array_temp[i]);
              }

              //console.log("testo:\n "+frasi_utili.join('\n'));


              let callback_obj = {id: id, pe: pe, first_sentence: first_sentence, text: frasi_utili};

              out.push(callback_obj);

              console.log("Articolo "+k+" "+pe);

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