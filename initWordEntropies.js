const {getAllWordModels} = require("./models/Word");
const generateMaskBetweenTwoWords = require("./libs/generateMaskBetweenTwoWords")
const hashMask = require("./libs/hashMask");

async function getWordEntropy(j,words) {
	const word1 = words[j];
	const timeA = new Date();
	//if ((j+1) % whenShowLog === 0)
	console.log("word "+(j+1)+"/"+words.length);
	const combinaisonsByHash = {}, nbWordsByHashCombinaison = {}
	for (const word2 of words) {
		if (word1.word === word2.word)
			continue;

		const combinaison = generateMaskBetweenTwoWords(word1.word,word2.word);
		const hash = hashMask(combinaison);

		if (!combinaisonsByHash[hash])
			combinaisonsByHash[hash] = combinaison;

		nbWordsByHashCombinaison[hash] = (nbWordsByHashCombinaison[hash]??0) + 1
	}
	word1.combinaisons = Object.keys(combinaisonsByHash).map(hash => ({
		hash,
		placeds: Object.entries(combinaisonsByHash[hash].placeds)
			.map(([index,letter]) => ({index, letter})),
		badPlaceds: Object.entries(combinaisonsByHash[hash].badPlaceds)
			.map(([index,letter]) => ({index, letter})),
		absents: combinaisonsByHash[hash].absents,
		nbWords: nbWordsByHashCombinaison[hash]
	}));

	await word1.save()
	console.log("finished in "+((new Date().getTime())-timeA.getTime())+" ms");
}

async function getAllWordsEntropyFromModel(i,models) {
	const model = models[i];
	console.log("model "+model.modelName+" "+(i+1)+"/"+models.length);
	const words = await model.find();
	console.log(words.length+" words found");
	//const whenShowLog = Math.floor(words.length/10);

	//await Promise.all(words.map((_,j) => getWordEntropy(j,words)))
	for (let j=0;j<words.length;j++) {
		await getWordEntropy(j,words);
	}
}

async function initWordEntropies() {
	const models = await getAllWordModels();
	for (let i=0;i<models.length;i++) {
		await getAllWordsEntropyFromModel(i,models);
	}
	process.exit();
}

initWordEntropies();