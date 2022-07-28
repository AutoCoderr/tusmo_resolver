function getWords(obj) {
	const url = window.url;

	const {nbLevels, lenWord} = getWordMeta();

	return fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(obj)
	}).then(res => res.json());
}

function tryWord(word, onLose = null, onNewLevel = null, onNewRound = null, onNotExistsWord = null) {
	const {realNbLevels} = getWordMeta();
	const nbFoundWords = getNbFoundWords();

	for (const letter of word) {
		pressKey(letter);
	}
	pressKey("ENTER");

	setTimeout(async () => {
		if (canPlayTusmo()) {
			const {realNbLevels: newRealNbLevels, nbLevels} = getWordMeta();
			if (newRealNbLevels > realNbLevels && onNewLevel) {
				return onNewLevel(nbLevels-1);
			}
			setTimeout(() => {
				const newNbFoundWords = getNbFoundWords();
				const tab = getTab();

				if (onNewRound && nbFoundWords !== null && tab && newNbFoundWords > nbFoundWords)
					return onNewRound()

				if (onNotExistsWord && tab && nbFoundWords !== null && newNbFoundWords === nbFoundWords)
					return onNotExistsWord()

				if (onLose && tab === null)
					return onLose()
			}, 2000)
		} else if (onLose) {
			return onLose();
		}
	}, 500)
}
