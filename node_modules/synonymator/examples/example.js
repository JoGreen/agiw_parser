"use strict";
const Synonymator = require("../");
const API_KEY = "Get an api key @ https://words.bighugelabs.com/api.php";

let syn = new Synonymator(API_KEY);

syn.synonyms("time").then((data) => {
  console.log(data)
});

syn.synonymsNoun("time").then((data) => {
  console.log(data)
});

syn.synonymsVerb("time").then((data) => {
  console.log(data)
});
