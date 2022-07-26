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
