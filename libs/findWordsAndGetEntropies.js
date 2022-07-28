const findWords = require("./findWords");
const {getAllPlaceds} = require("./globalLevelsData");
const getWordModel = require("../models/getWordModel");
const calculWordEntropy = require("./calculWordEntropy");

module.exports = async function findWordsAndGetEntropies({len, levels}) {
	const allPlaceds = getAllPlaceds(levels);
	const nbTotalWords = await getWordModel(len).then(Word => Word.count());

	return findWords({len, levels})
		.then(words => Promise.all(words.map(async word => ({
			word,
			entropy: await calculWordEntropy(allPlaceds,nbTotalWords,levels,word)
		}))))
		.then(words => words.sort(({e1},{e2}) => e1-e2))
}
