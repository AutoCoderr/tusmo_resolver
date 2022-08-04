const {getWordModel} = require("../models/Word");
const {getAllAbsents, getAllPlaceds, getAllBadPlaceds} = require("./globalLevelsData");


require("./public/numberFunctions");
require("./stringFunctions");
require("./objectFunctions");

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
	}).sort({percentUse: -1})
		.then(words => {
			/*
				Formule mathématique pour calculer le nombre précis d'occurences attendues pour chaque lettre jaune :
				Pour chaque lettre :

				j(n): nombre de jaunes au niveau n
				r(n): nombre de rouges au niveau n
				s(n): si j(n) est strict ou non

				J : nombre de jaunes attendus = 0
				R : nombre de rouges à la dernière ligne = 0
				S : si oui, vérifier si > à J, sinon vérifier si >= à J = false

				Exemple :
				0:
				j(0) = 2 ; r(0) = 1 ; s(0) = false
				1:
				j(1) = 2 ; r(1) = 2 ; s(0) = true
				2:
				j(2) = 4 ; r(2) = 0


				Niveau n = 0
				J = j(0)
				R = r(0)
				S = s(0)


				Niveau n > 0

				l = r(n)-R
				R = r(n)
				J = max(j(n),J-l)
				S = S ou s(n)
			*/

			const {currentNbBadPlacedsByLetter, globalIsStrictByBadPlacedLetter} = levels.reduce(({currentNbPlacedsByLetter,currentNbBadPlacedsByLetter, globalIsStrictByBadPlacedLetter},{placeds,badPlaceds,absents}) => {
				// defini r(n) pour chaque lettre
				const nbPlacedsByLetter = Object.values(placeds).reduce((acc,letter) => ({
					...acc,
					[letter]: acc[letter] ? acc[letter]+1 : 1
				}).freeze(), {}.freeze())
				// defini j(n) pour chaque lettre
				const nbBadPlacedsByLetter = Object.values(badPlaceds).reduce((acc,letter) => ({
					...acc,
					[letter]: acc[letter] ? acc[letter]+1 : 1
				}).freeze(), {}.freeze())
				// defini s(n) pour chaque lettre
				const isStrictByBadPlacedLetter = Object.keys(nbBadPlacedsByLetter).reduce((acc,letter) => ({
					...acc,
					[letter]: absents.includes(letter)
				}).freeze(), {}.freeze())


				// l = r(n)-R pour chaque lettre
				const differencesNbPlacedByLettersFromCurrentLevel = Object.entries(nbPlacedsByLetter).reduce((acc,[letter,n]) => ({
					...acc,
					[letter]: n - (currentNbPlacedsByLetter[letter]??0)
				}).freeze(), {}.freeze())
				const differencesNbPlacedByLetters = Object.entries(currentNbPlacedsByLetter).reduce((acc,[letter,n]) => ({
					...acc,
					[letter]: acc[letter] ?? (0 - n)
				}).freeze(), differencesNbPlacedByLettersFromCurrentLevel);

				// R = r(n) pour chaque lettre
				const newCurrentNbPlacedsByLetter = nbPlacedsByLetter;

				// J = max(j(n),J-l) pour chaque lettre
				const newCurrentNbBadPlacedsByLetter = Object.entries(nbBadPlacedsByLetter).reduce((acc,[letter,n]) => ({
					...acc,
					[letter]: Math.max(n,currentNbBadPlacedsByLetter[letter] ? currentNbBadPlacedsByLetter[letter]-(differencesNbPlacedByLetters[letter]??0) : 0)
				}).freeze(), {}.freeze());

				// S = S ou s(n) pour chaque lettre
				const newGlobalIsStrictByBadPlacedLetter = Object.entries(isStrictByBadPlacedLetter).reduce((acc,[letter,strict]) => ({
					...acc,
					[letter]: globalIsStrictByBadPlacedLetter[letter] || strict
				}).freeze(), {}.freeze())

				return {
					currentNbPlacedsByLetter: newCurrentNbPlacedsByLetter,
					currentNbBadPlacedsByLetter: newCurrentNbBadPlacedsByLetter,
					globalIsStrictByBadPlacedLetter: newGlobalIsStrictByBadPlacedLetter
				}.freeze();
			}, {currentNbPlacedsByLetter: {}, currentNbBadPlacedsByLetter: {}, globalIsStrictByBadPlacedLetter: {}}.freeze());

			const {placeds: lastPlaceds} = levels[levels.length-1];

			return words.filter(({word}) => !Object.entries(currentNbBadPlacedsByLetter).some(([letter,n]) => {
				const nbOccurs = word.count((c,i) => lastPlaceds[i] === undefined && c === letter);
				return (
					nbOccurs < n ||
					(globalIsStrictByBadPlacedLetter[letter] && nbOccurs > n)
				)
			}))
		})
}
