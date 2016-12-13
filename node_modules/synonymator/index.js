'use strict';
var request = require("request-promise");

class Synonymator {

  constructor(api_key) {
    if (api_key) {
      this.api_key = api_key;
    } else {
      throw new Error("No api key passed");
    }
  }
  
  lookup(word) {
    return request({
      method: "GET",
      url: `http://words.bighugelabs.com/api/2/${this.api_key}/${word}/json`,
      json: {}
    });
  }

  synonymsNoun(word) {
    return this.lookup(word).then((data) => data.noun.syn);
  }

  synonymsVerb(word) {
    return this.lookup(word).then((data) => data.verb.syn);
  }

  synonyms(word) {
    return this.lookup(word).then((data) => data.noun.syn.concat(data.verb.syn));
  }
}
module.exports = Synonymator;
