function getWords(url = window.url) {
	const {nbLevels, lenWord} = getWordMeta();

	return fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			len: lenWord,
			levels: nbLevels.map(i => getLevelInfos(i))
		})
	}).then(res => res.json());
}
