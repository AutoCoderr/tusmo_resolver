const generatePlayerId = require("./generatePlayerId");
const rand = require("./rand");
const {startMotus, joinMotus} = require("./APIActions");
const {getDatasFromJoinResponse, getShortIdFromStartMotus} = require("./getAPIDatas");
const findWord = require("../findWord");

async function bot() {
	const url = "https://www.tusmo.xyz/graphql";

	const shortId = await startMotus(url).then(getShortIdFromStartMotus);

	const playerId = generatePlayerId();

	const data = await joinMotus(url, shortId, playerId).then(getDatasFromJoinResponse)

	const words = await findWord(data).then(words => words.map(({formattedWord}) => formattedWord));

	const word = words[rand(0,words.length-1)];

	console.log(JSON.stringify(data));
	console.log(word);
}

module.exports = bot;
