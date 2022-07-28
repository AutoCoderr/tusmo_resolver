function listCombinaisonsWordsMask(allPlaceds, word, level = {placeds: {}, badPlaceds: {}, absents: []}, i = 0) {
	if (i === word.length)
		return [level];

	const {placeds, badPlaceds, absents} = level;

	const attempts = allPlaceds[i] !== undefined ?
		[
			{
				placeds: {
					...placeds,
					[i]: word[i]
				},
				badPlaceds,
				absents
			}
		] :
		[
			{
				placeds: {
					...placeds,
					[i]: word[i]
				},
				badPlaceds,
				absents
			},
			{
				placeds,
				badPlaceds: {
					...badPlaceds,
					[i]: word[i]
				},
				absents
			},
			{
				placeds,
				badPlaceds,
				absents: [...absents, word[i]]
			}
		]

	return attempts.reduce((acc,attempt) => [
		...acc,
		...listCombinaisonsWordsMask(
			allPlaceds,
			word,
			attempt,
			i + 1
		)
	], [])
}

module.exports = listCombinaisonsWordsMask;
