const listCombinaisonsWordsMask = require("./listCombinasonsWordMask");
const calculInformation = require("./calculInformation");
const calculP = require("./calculP");
const findWords = require("./findWords");

function calculWordEntropy(allPlaceds, nbTotalWords, levels, word) {
	return Promise.all(
		listCombinaisonsWordsMask(allPlaceds, word).map(level =>
			findWords({len: word.length, levels: [...levels, level]}, false)
				.then(words => {
					const P = calculP(words.length, nbTotalWords);
					const I = calculInformation(P);
					return {P, I}
				})
		)
	)
		.then(informations =>
			informations.filter(({P}) => P !== 0)
		)
		.then(informations => {
			return informations.reduce((acc,{P,I}) => acc + P*I,0)/informations.length;
		})
}

module.exports = calculWordEntropy;
