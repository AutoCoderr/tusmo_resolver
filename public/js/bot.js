function canPlayBot() {
	return new RegExp("^\\/[a-z\\d]{8}").test(location.pathname);
}

function rand(a,b) {
	return a+Math.floor(Math.random()*(b-a+1));
}

function tryWords(words, data, lastWord = null) {
	const word = words[rand(0,words.length-1)];

	tryWord(
		word,
		() => {
			console.log("LOSE");
		},
		async (n) => {
			const newData = {
				len: data.len,
				levels: [
					...(n > 0 ? data.levels : []),
					getLevelInfos(n)
				]
			}
			tryWords(
				await getWords(newData).then(words => words.map(({formattedWord}) => formattedWord)),
				newData,
				word,
			)
		},
		() => tryGames(),
		() => {
			tryWords(
				words.filter(eachWord => word !== eachWord),
				data,
				word
			)
		}
	)
}

function checkPageAndTryGames() {
	if (!canPlayBot())
		return;
	initKeys();
	tryGames();
}

async function tryGames() {

	const {lenWord, nbLevels} = getWordMeta();

	const data = {
		len: lenWord,
		levels: nbLevels.map(i => getLevelInfos(i))
	}

	const words = await getWords(data).then(words => words.map(({formattedWord}) => formattedWord));

	tryWords(words);
}
