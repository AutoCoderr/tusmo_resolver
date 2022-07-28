const getWordModel = require("../models/getWordModel");
const {getAllAbsents, getAllPlaceds, getAllBadPlaceds} = require("./globalLevelsData");


require("./public/numberFunctions");

/*const t = {
    len: 9,
    levels: [
        {
            placeds: {
                0: 'L',
                1: 'A',
            },
            badPlaceds: {
                5: 'E',
                6: 'R'
            },
            absents: ['I','T','E','S']
        },
        {
            placeds: {
                0: 'L',
                1: 'A',
            },
            badPlaceds: {
                5: 'U',

                7: 'E'
            },
            absents: ['D']
        }
    ]
}*/

function generateRegex({len, levels}, allAbsents, allPlaceds, allBadPlaceds) {

	return "^" + len.reduce((regex, i) =>
		regex + (
			allPlaceds[i] ?
				allPlaceds[i] :
				allBadPlaceds[i] ?
					"[^" + [...allAbsents, ...allBadPlaceds[i]].join("") + "]" :
					allAbsents.length > 1 ?
						"[^" + allAbsents.join("") + "]" :
						"."
		), "") + "$"
}

module.exports = async function findWord({len, levels},_allPlaceds = null,_allBadPlaceds = null, _allAbsents = null) {
	const [allPlaceds, allBadPlaceds, allAbsents] = [[_allPlaceds,getAllPlaceds],[_allBadPlaceds,getAllBadPlaceds],[_allAbsents,getAllAbsents]].map(([v,f]) => v ?? f(levels))

	const Word = await getWordModel(len);

	return Word.find({
		word: {$regex: generateRegex({len, levels},allAbsents,allPlaceds,allBadPlaceds)}
	})
		.then(words => words.map(({word}) => word))
		.then(words => {
			const computedBadPlacedsByLevel = levels.map(({badPlaceds}) =>
				Object.entries(badPlaceds).reduce((acc, [index, letter]) => ({
					...acc,
					[letter]: acc[letter] ? [...acc[letter], parseInt(index)] : [parseInt(index)]
				}), {})
			);
			const inAbsentBadPlacedLetterByLevel = levels.map(({absents}, i) =>
				Object.keys(computedBadPlacedsByLevel[i]).reduce((acc, letter) => ({
					...acc,
					[letter]: absents.includes(letter)
				}), {})
			)
			const unknownIndexesByLevel = levels.map(({placeds}) =>
				len.filter(i => placeds[i] === undefined)
			);

			return words.filter(word =>
				!levels.some(({absents}, i) => {
					const computedBadPlaceds = computedBadPlacedsByLevel[i];
					const unknownIndexes = unknownIndexesByLevel[i];

					return Object.entries(computedBadPlaceds).some(([letter, indexes]) => {
						const nbAppear = unknownIndexes.filter(index => word[index] === letter).length
						return (
							nbAppear < indexes.length ||
							(inAbsentBadPlacedLetterByLevel[i][letter] && nbAppear > indexes.length) ||
							(!inAbsentBadPlacedLetterByLevel[i][letter] && nbAppear > unknownIndexes.length - indexes.length)
						)
					})
				})
			)
		})
}
