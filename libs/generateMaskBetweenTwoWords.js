require("./public/numberFunctions");

function generateMaskBetweenTwoWords(enteredWord,inDBWord) {
	enteredWord.length.reduce(({placeds, badPlaceds, absents},i) => ({
		placeds: enteredWord[i] === inDBWord[i] ?
			{
				...placeds,
				[i]: enteredWord[i]
			} : placeds,
		badPlaceds: (
			enteredWord[i] !== inDBWord[i] &&
			inDBWord.length.some(j =>
				inDBWord[j] === enteredWord[i] &&
				inDBWord[j] !== enteredWord[j]
			)
		) ? {
			...badPlaceds,
			[i]: enteredWord[i]
		} : badPlaceds,
		absents: !inDBWord.length.filter(j => inDBWord[j] === enteredWord[i]).length
	}), {placeds: {}, badPlaceds: {}, absents: []})
}
