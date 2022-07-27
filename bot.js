const generatePlayerId = require("./libs/generatePlayerId");
const rand = require("./libs/rand");
const {startMotus, joinMotus, tryWord} = require("./libs/APIActions");
const {getDatasFromJoinResponse, getShortIdFromStartMotus, getInfosFromTryWordResponse} = require("./libs/getAPIDatas");
const findWord = require("./findWord");

async function tryWords(url, shortId, playerId, words, data, currentRound = 1, currentTry = 1) {
	if (words.length === 0) {
		console.log("No word found, at round "+currentRound+" step "+currentTry);
		console.log("data =>");
		console.log(JSON.stringify(data, null, "\t"));
		return;
	}
	//console.log({data});
	//console.log("tryWords");
	//console.log({currentTry, currentRound});
	const word = words[rand(0,words.length-1)]
	const {wordExists, hasFoundWord, level, score} = await tryWord(url, word, shortId, playerId).then(getInfosFromTryWordResponse);
	//console.log({wordExists, hasFoundWord, level, score})
	if (hasFoundWord) {
		console.log("Word found '"+word+"' ; score : "+score)
		const newData = await joinMotus(url, shortId, playerId).then(getDatasFromJoinResponse);
		return tryWords(
			url,
			shortId,
			playerId,
			await findWord(newData).then(words => words.map(({formattedWord}) => formattedWord)),
			newData,
			currentRound+1
		)
	}

	if (!wordExists)
		return tryWords(url, shortId, playerId, words.filter(eachWord => eachWord !== word), data, currentRound, currentTry)

	if (currentTry === 6) {
		console.log("Fail at round "+currentRound+" ; score : "+score);
		return;
	}
	const newData = {
		len: data.len,
		levels: [
			...data.levels,
			level
		]
	}
	return tryWords(
		url,
		shortId,
		playerId,
		await findWord(newData).then(words => words.map(({formattedWord}) => formattedWord)),
		newData,
		currentRound,
		currentTry+1
	)
}

async function tryParty() {
	const url = "https://www.tusmo.xyz/graphql";

	const shortId = await startMotus(url).then(getShortIdFromStartMotus);

	const playerId = generatePlayerId();

	const data = await joinMotus(url, shortId, playerId).then(getDatasFromJoinResponse)

	const words = await findWord(data).then(words => words.map(({formattedWord}) => formattedWord));

	return tryWords(url, shortId, playerId, words, data);
}

function launch(methods) {
	const [,,method] = process.argv;
	if (!methods[method]) {
		console.log("Method '"+method+"' does not exist");
		process.exit();
	}
	methods[method]().then(() => {
		process.exit();
	})
}

const methods = {tryParty};

launch(methods);

module.exports = methods;
