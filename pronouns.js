
// he she it they
module.exports = function(sentences){
	let text = sentences.join('\n');

	let he_count = {matching: (text.match(/[^A-Za-z]he /i)) ? text.match(/[^A-Za-z]he /ig) :[] };
	he_count.pronoun = 'he';
	let she_count = {matching: (text.match(/[^A-Za-z]she /i)) ? text.match(/[^A-Za-z]she /ig) :[] };
	she_count.pronoun = 'she';
	let it_count = {matching: (text.match(/[^A-Za-z]it /i)) ? text.match(/[^A-Za-z]it /ig) :[] };
	it_count.pronoun = 'it';
	let they_count = {matching: (text.match(/[^A-Za-z]they /i)) ? text.match(/[^A-Za-z]they /ig) :[] };
	they_count.pronoun = 'they';

	let first_compare = (he_count.matching.length >= she_count.matching.length ) ? he_count : she_count;
	let second_compare = (it_count.matching.length >= they_count.matching.length ) ? it_count : they_count;

	let final_compare = (second_compare.matching.length >= first_compare.matching.length) ? second_compare : first_compare;
	console.log(final_compare.matching.length+'  '+final_compare.pronoun);
	return final_compare.pronoun;


}