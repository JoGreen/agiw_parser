Synonymator
===

A client for Big Huge Thesaurus <https://words.bighugelabs.com/api.php>.

### Installing
```bash
npm install --save synonymator
```
### Usage
```javascript
"use strict";
const Synonymator = require("../");
const API_KEY = "Get an api key @ https://words.bighugelabs.com/api.php";

let syn = new Synonymator(API_KEY);

// in each example, data is an array
syn.synonyms("time").then((data) => {
  console.log(data);
});

syn.synonymsNoun("time").then((data) => {
  console.log(data);
});

syn.synonymsVerb("time").then((data) => {
  console.log(data);
});

```
