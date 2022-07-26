const request = require("./request");

function getAPIResponse({status,body}) {
	if (status === 200)
		return JSON.parse(body);

	throw new Error("Unable to reach tusmo API, code "+status);
}

function startMotus(url) {
	return request(url+"?opname=StartMotus", {
		method: "POST",
		body: JSON.stringify({
			operationName: "StartMotus",
			query: "mutation StartMotus($type: String!, $lang: String!) {  startMotus(type: $type, lang: $lang) {    shortId    __typename  }}",
			variables: {
				lang: "fr",
				type: "SOLO"
			}
		})
	}).then(getAPIResponse)
}

function joinMotus(url,shortId, playerId) {
	return request(url+"?opname=JoinMotus", {
		method: "POST",
		body: JSON.stringify({
			operationName: "JoinMotus",
			query: "mutation JoinMotus($shortId: ID!, $playerId: ID!, $playerName: String, $accessToken: String) {\n joinMotus(\n shortId: $shortId\n playerId: $playerId\n playerName: $playerName\n accessToken: $accessToken\n ) {\n shortId\n type\n state\n lang\n currentRound\n isStarted\n isEnded\n playersNumber\n rounds {\n _id\n firstLetter\n length\n __typename\n }\n me {\n _id\n name\n hasWon\n currentRound\n state\n rounds {\n score\n hasFoundWord\n tries {\n word\n validation\n wordExists\n hasFoundWord\n mask\n __typename\n }\n __typename\n }\n __typename\n }\n __typename\n }\n}",
			variables: {
				accessToken: "",
				playerId,
				playerName: "",
				shortId
			}
		}),
	}).then(getAPIResponse)
}

function tryWord(url,word, shortId, playerId) {
	return request(url+"?opname=TryWord", {
		method: "POST",
		body: JSON.stringify({
			operationName: "TryWord",
			query: "mutation TryWord($shortId: ID!, $word: String!, $playerId: ID!, $lang: String!, $accessToken: String) {\n tryWord(\n shortId: $shortId\n word: $word\n playerId: $playerId\n lang: $lang\n accessToken: $accessToken\n ) {\n word\n validation\n wordExists\n hasFoundWord\n mask\n score\n __typename\n }\n}",
			variables: {
				accessToken: "",
				lang: "fr",
				playerId,
				shortId,
				word
			}
		})
	})
}

module.exports = {startMotus, joinMotus, tryWord};
