function getShortIdFromStartMotus({data: {startMotus: {shortId}}}) {
	return shortId;
}

function getLevelFromAPIData({validation, word}) {
	return validation.reduce(({placeds, badPlaceds, absents},type,i) => ({
		placeds: type === 'r' ? {
			...placeds,
			[i]: word[i]
		} : placeds,
		badPlaceds: type === 'y' ? {
			...badPlaceds,
			[i]: word[i]
		} : badPlaceds,
		absents: type === '-' ? [...absents, word[i]] : absents
	}), {placeds: {}, badPlaceds: {}, absents: []})
}

function getLevelInfosFromTryWordResponse({data: {tryWord}}) {
	return getLevelFromAPIData(tryWord);
}

function getDatasFromJoinResponse({data: {joinMotus: {rounds, me: {rounds: myRounds}}}}) {
	const lastRound = rounds[rounds.length-1];
	const myLastRound = myRounds[myRounds.length-1];

	const {firstLetter, length} = lastRound;

	const {tries} = myLastRound;

	return {
		len: length,
		levels: [
			{
				placeds: {
					0: firstLetter
				},
				badPlaceds: {},
				absents: []
			},
			...tries.map(getLevelFromAPIData)
		]
	}
}

module.exports = {getDatasFromJoinResponse,getLevelInfosFromTryWordResponse, getShortIdFromStartMotus}
