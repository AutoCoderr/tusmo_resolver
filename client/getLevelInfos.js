function getLevelInfos(n) {
	const {nbLevels, lenWord} = getWordMeta();

	if (n >= nbLevels || n < 0)
		throw new Error("Level '"+n+"' inexistant");

	const tab = getTab();
	const cells = getCellsByRange(getCells(tab), n*lenWord, (n+1)*lenWord);

	return cells.reduce(({placeds, badPlaceds, absents},cell, i) => {
		const {letter, type} = getCellTypeAndLetter(cell);

		return {
			placeds: (["placed","beginning"].includes(type)) ? {
				...placeds,
				[i]: letter
			} : placeds,
			badPlaceds: type === "badPlaced" ? {
				...badPlaceds,
				[i]: letter
			} : badPlaceds,
			absents: type === "absent" ? [ ...absents, letter ] : absents
		}
	}, {placeds: {}, badPlaceds: {}, absents: []});
}
